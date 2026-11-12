<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Order;
use App\Entity\OrderLine;
use App\Entity\OrderStatusHistory;
use App\Entity\Product;
use App\Repository\CouponRepository;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Support\ApiException;
use App\Support\Serializer;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Throwable;

final class OrderService
{
    private const TAX_RATE = 0.08;
    private const SHIPPING_COST = 0;

    private const PAYMENT_METHODS = ['cod', 'bank-transfer', 'easypaisa', 'jazzcash'];

    private const STATUSES = [
        'processing',
        'confirmed',
        'shipped',
        'out-for-delivery',
        'delivered',
        'cancelled',
    ];

    private const TRANSITIONS = [
        'processing' => ['confirmed', 'cancelled'],
        'confirmed' => ['shipped', 'cancelled'],
        'shipped' => ['out-for-delivery', 'cancelled'],
        'out-for-delivery' => ['delivered', 'cancelled'],
        'delivered' => [],
        'cancelled' => [],
    ];

    public function __construct(
        private readonly OrderRepository $orders,
        private readonly ProductRepository $products,
        private readonly CouponRepository $coupons,
        private readonly EntityManagerInterface $em,
        private readonly MailService $mail,
    ) {
    }

    /** @return list<array<string, mixed>> */
    public function list(): array
    {
        return Serializer::orders($this->orders->all());
    }

    /** @return array<string, mixed> */
    public function get(string $orderNumber): array
    {
        $order = $this->orders->findByNumber($orderNumber);

        if ($order === null) {
            throw ApiException::notFound('Order not found.');
        }

        return Serializer::order($order);
    }

    /** @return array<string, mixed> */
    public function track(string $orderNumber, string $email): array
    {
        $order = $this->orders->findByNumberAndEmail($orderNumber, $email);

        if ($order === null) {
            throw ApiException::notFound('No order matches that number and email.');
        }

        return Serializer::order($order);
    }

    /** @param array<string, mixed> $payload @return array<string, mixed> */
    public function place(array $payload): array
    {
        $shipping = is_array($payload['shipping'] ?? null) ? $payload['shipping'] : [];
        $items = is_array($payload['items'] ?? null) ? $payload['items'] : [];
        $errors = [];

        $required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country'];

        foreach ($required as $field) {
            $value = isset($shipping[$field]) && is_scalar($shipping[$field]) ? trim((string) $shipping[$field]) : '';
            $shipping[$field] = $value;

            if ($value === '') {
                $errors['shipping.' . $field] = 'This field is required.';
            }
        }

        if (!filter_var((string) ($shipping['email'] ?? ''), FILTER_VALIDATE_EMAIL)) {
            $errors['shipping.email'] = 'Enter a valid email address.';
        }

        if ($items === []) {
            $errors['items'] = 'Your cart is empty.';
        }

        /** @var list<array{0: Product, 1: int}> $resolved */
        $resolved = [];

        foreach ($items as $index => $item) {
            if (!is_array($item)) {
                $errors['items.' . $index] = 'Invalid cart item.';
                continue;
            }

            $productId = isset($item['productId']) && is_scalar($item['productId'])
                ? trim((string) $item['productId'])
                : '';
            $quantity = isset($item['quantity']) && is_numeric($item['quantity'])
                ? (int) $item['quantity']
                : 0;

            if ($productId === '') {
                $errors['items.' . $index . '.productId'] = 'Product is required.';
                continue;
            }

            if ($quantity < 1) {
                $errors['items.' . $index . '.quantity'] = 'Quantity must be at least 1.';
                continue;
            }

            $product = $this->products->findById($productId);

            if ($product === null) {
                $errors['items.' . $index . '.productId'] = 'Product not found.';
                continue;
            }

            if (!$product->inStock || $product->stock < $quantity) {
                $errors['items.' . $index . '.quantity'] = sprintf(
                    'Only %d left in stock for %s.',
                    max(0, $product->stock),
                    $product->name,
                );
                continue;
            }

            $resolved[] = [$product, $quantity];
        }

        if ($errors !== []) {
            throw ApiException::validation('Please check your order details.', $errors);
        }

        $subtotal = 0;
        foreach ($resolved as [$product, $quantity]) {
            $subtotal += $product->price * $quantity;
        }

        $coupon = null;
        $couponCode = isset($payload['couponCode']) && is_scalar($payload['couponCode'])
            ? strtoupper(trim((string) $payload['couponCode']))
            : '';

        if ($couponCode !== '') {
            $coupon = $this->coupons->findByCode($couponCode);

            if ($coupon === null || !$coupon->active) {
                throw ApiException::validation('That coupon is not valid.', [
                    'couponCode' => 'That coupon is not valid.',
                ]);
            }
        }

        $discount = 0;
        if ($coupon !== null) {
            $discount = $coupon->type === 'percent'
                ? (int) round($subtotal * $coupon->value / 100)
                : min($coupon->value, $subtotal);
        }

        $taxable = max(0, $subtotal - $discount);
        $tax = (int) round($taxable * self::TAX_RATE);
        $shippingCost = self::SHIPPING_COST;
        $total = max(0, $taxable + $shippingCost + $tax);

        $paymentMethod = isset($payload['paymentMethod']) && is_scalar($payload['paymentMethod'])
            ? (string) $payload['paymentMethod']
            : 'cod';

        if (!in_array($paymentMethod, self::PAYMENT_METHODS, true)) {
            $paymentMethod = 'cod';
        }

        $order = new Order();
        $order->orderNumber = $this->nextOrderNumber();
        $order->placedAt = new DateTimeImmutable();
        $order->email = strtolower((string) $shipping['email']);
        $order->customerName = trim($shipping['firstName'] . ' ' . $shipping['lastName']);
        $order->shipping = $shipping;
        $order->subtotal = $subtotal;
        $order->shippingCost = $shippingCost;
        $order->discount = $discount;
        $order->tax = $tax;
        $order->total = $total;
        $order->couponCode = $coupon?->code;
        $order->paymentMethod = $paymentMethod;
        $order->status = 'processing';

        foreach ($resolved as [$product, $quantity]) {
            $line = new OrderLine();
            $line->order = $order;
            $line->productId = $product->id;
            $line->slug = $product->slug;
            $line->name = $product->name;
            $line->brand = $product->brand;
            $line->price = $product->price;
            $line->quantity = $quantity;
            $line->image = $product->images[0] ?? '';
            $order->lines->add($line);

            $product->stock -= $quantity;
            $product->inStock = $product->stock > 0;
        }

        $history = new OrderStatusHistory();
        $history->order = $order;
        $history->status = 'processing';
        $history->at = new DateTimeImmutable();
        $history->note = 'Order placed';
        $order->statusHistory->add($history);

        $connection = $this->em->getConnection();
        $connection->beginTransaction();

        try {
            $this->em->persist($order);
            $this->em->flush();
            $connection->commit();
        } catch (Throwable $exception) {
            $connection->rollBack();
            throw $exception;
        }

        $this->mail->orderPlaced($order);
        $this->mail->newOrderNotification($order);

        return Serializer::order($order);
    }

    /** @return array<string, mixed> */
    public function updateStatus(string $orderNumber, string $status, ?string $note = null): array
    {
        $order = $this->orders->findByNumber($orderNumber);

        if ($order === null) {
            throw ApiException::notFound('Order not found.');
        }

        $status = strtolower(trim($status));
        $previousStatus = $order->status;

        if (!in_array($status, self::STATUSES, true)) {
            throw ApiException::validation('Invalid order status.', [
                'status' => 'Choose one of: ' . implode(', ', self::STATUSES) . '.',
            ]);
        }

        if ($status !== $order->status) {
            $allowed = self::TRANSITIONS[$order->status] ?? [];

            if (!in_array($status, $allowed, true)) {
                throw ApiException::validation(
                    sprintf('An order cannot move from %s to %s.', $order->status, $status),
                    ['status' => 'Invalid status transition.'],
                );
            }
        }

        $order->status = $status;

        $history = new OrderStatusHistory();
        $history->order = $order;
        $history->status = $status;
        $history->at = new DateTimeImmutable();
        $history->note = $note !== null && trim($note) !== '' ? trim($note) : null;
        $order->statusHistory->add($history);

        $this->orders->save($order);

        if ($previousStatus !== $status) {
            $this->mail->orderStatus($order, $status, $history->note);
        }

        return Serializer::order($order);
    }

    private function nextOrderNumber(): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

        do {
            $suffix = '';
            for ($i = 0; $i < 6; $i++) {
                $suffix .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            }

            $number = 'WG-' . $suffix;
        } while ($this->orders->numberExists($number));

        return $number;
    }
}
