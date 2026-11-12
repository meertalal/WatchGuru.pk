<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Order;
use App\Repository\OrderRepository;

/**
 * Customers module. The storefront is guest-only, so a "customer" is the
 * aggregated order history for one email address. Nothing is stored twice.
 */
final class CustomerService
{
    public function __construct(private readonly OrderRepository $orders)
    {
    }

    /** @return list<array<string, mixed>> */
    public function list(): array
    {
        /** @var array<string, array<string, mixed>> $customers */
        $customers = [];

        foreach ($this->orders->all() as $order) {
            $key = strtolower($order->email);

            if (!isset($customers[$key])) {
                $customers[$key] = [
                    'email' => $key,
                    'name' => $order->customerName,
                    'phone' => $this->shippingValue($order, 'phone'),
                    'city' => $this->shippingValue($order, 'city'),
                    'ordersCount' => 0,
                    'totalSpent' => 0,
                    'firstOrderAt' => $order->placedAt->format(DATE_ATOM),
                    'lastOrderAt' => $order->placedAt->format(DATE_ATOM),
                    'orderNumbers' => [],
                ];
            }

            $customer = &$customers[$key];
            $customer['ordersCount']++;
            $customer['name'] = $order->customerName;
            $customer['phone'] = $this->shippingValue($order, 'phone') ?: $customer['phone'];
            $customer['city'] = $this->shippingValue($order, 'city') ?: $customer['city'];

            if ($order->status !== 'cancelled') {
                $customer['totalSpent'] += $order->total;
            }

            $placedAt = $order->placedAt->format(DATE_ATOM);
            if ($placedAt < $customer['firstOrderAt']) {
                $customer['firstOrderAt'] = $placedAt;
            }
            if ($placedAt > $customer['lastOrderAt']) {
                $customer['lastOrderAt'] = $placedAt;
            }

            $customer['orderNumbers'][] = $order->orderNumber;
            unset($customer);
        }

        $list = array_values($customers);
        usort($list, static fn (array $a, array $b): int => $b['totalSpent'] <=> $a['totalSpent']);

        foreach ($list as &$customer) {
            $customer['orderNumbers'] = array_slice($customer['orderNumbers'], 0, 5);
        }
        unset($customer);

        return $list;
    }

    private function shippingValue(Order $order, string $key): string
    {
        $value = $order->shipping[$key] ?? '';

        return is_scalar($value) ? (string) $value : '';
    }
}
