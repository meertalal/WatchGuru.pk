<?php

declare(strict_types=1);

namespace App\Support;

use App\Entity\Account;
use App\Entity\ContactMessage;
use App\Entity\Coupon;
use App\Entity\NewsletterSubscriber;
use App\Entity\Order;
use App\Entity\OrderLine;
use App\Entity\OrderStatusHistory;
use App\Entity\Product;
use App\Entity\StockMovement;
use App\Entity\WarrantySerial;

final class Serializer
{
    /** @return array<string, mixed> */
    public static function product(Product $product): array
    {
        return [
            'id' => $product->id,
            'slug' => $product->slug,
            'name' => $product->name,
            'brand' => $product->brand,
            'price' => $product->price,
            'compareAtPrice' => $product->compareAtPrice,
            'description' => $product->description,
            'highlights' => $product->highlights,
            'images' => $product->images,
            'category' => $product->category,
            'collections' => $product->collections,
            'dialColor' => $product->dialColor,
            'strapType' => $product->strapType,
            'caseMaterial' => $product->caseMaterial,
            'caseSize' => $product->caseSize,
            'movement' => $product->movement,
            'features' => $product->features,
            'specs' => $product->specs,
            'variants' => $product->variants,
            'badge' => $product->badge,
            'inStock' => $product->inStock,
            'stock' => $product->stock,
            'addedAt' => $product->addedAt->format('Y-m-d'),
        ];
    }

    /** @param iterable<Product> $products @return list<array<string, mixed>> */
    public static function products(iterable $products): array
    {
        $out = [];
        foreach ($products as $product) {
            $out[] = self::product($product);
        }

        return $out;
    }

    /** @return array<string, mixed> */
    public static function account(Account $account): array
    {
        return [
            'id' => (string) $account->id,
            'firstName' => $account->firstName,
            'lastName' => $account->lastName,
            'email' => $account->email,
            'phone' => $account->phone,
            'role' => $account->role,
            'createdAt' => $account->createdAt->format(DATE_ATOM),
        ];
    }

    /** @return array<string, mixed> */
    public static function coupon(Coupon $coupon): array
    {
        return [
            'id' => $coupon->id,
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'label' => $coupon->label,
            'active' => $coupon->active,
        ];
    }

    /** @param iterable<Coupon> $coupons @return list<array<string, mixed>> */
    public static function coupons(iterable $coupons): array
    {
        $out = [];
        foreach ($coupons as $coupon) {
            $out[] = self::coupon($coupon);
        }

        return $out;
    }

    /** @return array<string, mixed> */
    public static function stockMovement(StockMovement $movement): array
    {
        return [
            'id' => $movement->id,
            'productId' => $movement->productId,
            'productName' => $movement->productName,
            'type' => $movement->type,
            'quantity' => $movement->quantity,
            'balanceAfter' => $movement->balanceAfter,
            'reason' => $movement->reason,
            'reference' => $movement->reference,
            'createdAt' => $movement->createdAt->format(DATE_ATOM),
        ];
    }

    /** @param iterable<StockMovement> $movements @return list<array<string, mixed>> */
    public static function stockMovements(iterable $movements): array
    {
        $out = [];
        foreach ($movements as $movement) {
            $out[] = self::stockMovement($movement);
        }

        return $out;
    }

    /** @return array<string, mixed> */
    public static function warrantySerial(WarrantySerial $serial): array
    {
        return [
            'id' => $serial->id,
            'serial' => $serial->serial,
            'productId' => $serial->productId,
            'verified' => $serial->verifiedAt !== null,
            'verifiedAt' => $serial->verifiedAt?->format(DATE_ATOM),
            'createdAt' => $serial->createdAt->format(DATE_ATOM),
        ];
    }

    /** @param iterable<WarrantySerial> $serials @return list<array<string, mixed>> */
    public static function warrantySerials(iterable $serials): array
    {
        $out = [];
        foreach ($serials as $serial) {
            $out[] = self::warrantySerial($serial);
        }

        return $out;
    }

    /** @return array<string, mixed> */
    public static function newsletterSubscriber(NewsletterSubscriber $subscriber): array
    {
        return [
            'id' => $subscriber->id,
            'email' => $subscriber->email,
            'createdAt' => $subscriber->createdAt->format(DATE_ATOM),
        ];
    }

    /** @param iterable<NewsletterSubscriber> $subscribers @return list<array<string, mixed>> */
    public static function newsletterSubscribers(iterable $subscribers): array
    {
        $out = [];
        foreach ($subscribers as $subscriber) {
            $out[] = self::newsletterSubscriber($subscriber);
        }

        return $out;
    }

    /** @return array<string, mixed> */
    public static function contactMessage(ContactMessage $message): array
    {
        return [
            'id' => $message->id,
            'name' => $message->name,
            'email' => $message->email,
            'subject' => $message->subject,
            'message' => $message->message,
            'createdAt' => $message->createdAt->format(DATE_ATOM),
        ];
    }

    /** @param iterable<ContactMessage> $messages @return list<array<string, mixed>> */
    public static function contactMessages(iterable $messages): array
    {
        $out = [];
        foreach ($messages as $message) {
            $out[] = self::contactMessage($message);
        }

        return $out;
    }

    /** @return array<string, mixed> */
    public static function order(Order $order): array
    {
        return [
            'orderNumber' => $order->orderNumber,
            'placedAt' => $order->placedAt->format(DATE_ATOM),
            'email' => $order->email,
            'customerName' => $order->customerName,
            'shipping' => $order->shipping,
            'lines' => array_map(
                static fn (OrderLine $line): array => [
                    'productId' => $line->productId,
                    'slug' => $line->slug,
                    'name' => $line->name,
                    'brand' => $line->brand,
                    'price' => $line->price,
                    'quantity' => $line->quantity,
                    'image' => $line->image,
                ],
                $order->lines->toArray(),
            ),
            'subtotal' => $order->subtotal,
            'shippingCost' => $order->shippingCost,
            'discount' => $order->discount,
            'tax' => $order->tax,
            'total' => $order->total,
            'couponCode' => $order->couponCode,
            'paymentMethod' => $order->paymentMethod,
            'status' => $order->status,
            'statusHistory' => array_map(
                static fn (OrderStatusHistory $entry): array => [
                    'status' => $entry->status,
                    'at' => $entry->at->format(DATE_ATOM),
                    'note' => $entry->note,
                ],
                $order->statusHistory->toArray(),
            ),
        ];
    }

    /** @param iterable<Order> $orders @return list<array<string, mixed>> */
    public static function orders(iterable $orders): array
    {
        $out = [];
        foreach ($orders as $order) {
            $out[] = self::order($order);
        }

        return $out;
    }
}
