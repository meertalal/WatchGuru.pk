<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Product;
use App\Entity\StockMovement;
use App\Repository\ProductRepository;
use App\Repository\StockMovementRepository;
use App\Support\ApiException;
use App\Support\Env;
use App\Support\Serializer;
use Doctrine\ORM\EntityManagerInterface;
use Throwable;

/**
 * Inventory module. Stock levels live on the product entity, but every change
 * made here is journaled in `stock_movements` so the team can audit balances.
 */
final class StockService
{
    private const TYPES = ['in', 'out', 'correction'];

    public function __construct(
        private readonly ProductRepository $products,
        private readonly StockMovementRepository $movements,
        private readonly EntityManagerInterface $em,
    ) {
    }

    /** @return array{summary: array<string, mixed>, levels: list<array<string, mixed>>, movements: list<array<string, mixed>>} */
    public function overview(?string $productId = null): array
    {
        $products = $this->products->all();
        $threshold = $this->threshold();

        return [
            'summary' => $this->summary($products, $threshold),
            'levels' => Serializer::products($products),
            'movements' => Serializer::stockMovements($this->movements->all($productId)),
            'threshold' => $threshold,
        ];
    }

    /** @return list<array<string, mixed>> */
    public function movements(?string $productId = null): array
    {
        return Serializer::stockMovements($this->movements->all($productId));
    }

    /**
     * @param array<string, mixed> $input
     * @return array<string, mixed>
     */
    public function adjust(array $input): array
    {
        $productId = isset($input['productId']) && is_scalar($input['productId'])
            ? trim((string) $input['productId'])
            : '';
        $type = isset($input['type']) && is_scalar($input['type'])
            ? strtolower(trim((string) $input['type']))
            : '';
        $quantity = isset($input['quantity']) && is_numeric($input['quantity'])
            ? (int) $input['quantity']
            : 0;
        $reason = isset($input['reason']) && is_scalar($input['reason'])
            ? trim((string) $input['reason'])
            : '';

        $errors = [];

        if ($productId === '') {
            $errors['productId'] = 'Choose a product.';
        }

        if (!in_array($type, self::TYPES, true)) {
            $errors['type'] = 'Choose in, out or correction.';
        }

        if ($type !== 'correction' && $quantity < 1) {
            $errors['quantity'] = 'Quantity must be at least 1.';
        }

        if ($type === 'correction' && ($quantity < 0 || !isset($input['quantity']))) {
            $errors['quantity'] = 'Enter the new stock level (zero or greater).';
        }

        if ($errors !== []) {
            throw ApiException::validation('Please check the stock adjustment.', $errors);
        }

        $product = $this->products->findById($productId);

        if ($product === null) {
            throw ApiException::notFound('Product not found.');
        }

        $delta = match ($type) {
            'in' => $quantity,
            'out' => -$quantity,
            default => $quantity - $product->stock,
        };

        if ($type === 'out' && $quantity > $product->stock) {
            throw ApiException::validation('Not enough stock on hand.', [
                'quantity' => sprintf('Only %d in stock for %s.', $product->stock, $product->name),
            ]);
        }

        $connection = $this->em->getConnection();
        $connection->beginTransaction();

        try {
            $product->stock = max(0, $product->stock + $delta);
            $product->inStock = $product->stock > 0;
            $this->products->save($product, false);

            $movement = new StockMovement();
            $movement->productId = $product->id;
            $movement->productName = $product->name;
            $movement->type = $type;
            $movement->quantity = $delta;
            $movement->balanceAfter = $product->stock;
            $movement->reason = $reason !== '' ? $reason : $this->defaultReason($type);
            $this->movements->save($movement, false);

            $this->em->flush();
            $connection->commit();
        } catch (Throwable $exception) {
            $connection->rollBack();
            throw $exception;
        }

        return Serializer::stockMovement($movement);
    }

    private function threshold(): int
    {
        $value = Env::int('STOCK_LOW_THRESHOLD', 5);

        return $value > 0 ? $value : 5;
    }

    /**
     * @param list<Product> $products
     * @return array<string, mixed>
     */
    private function summary(array $products, int $threshold): array
    {
        $units = 0;
        $retailValue = 0;
        $low = 0;
        $soldOut = 0;

        foreach ($products as $product) {
            $units += $product->stock;
            $retailValue += $product->price * $product->stock;

            if ($product->stock === 0) {
                $soldOut++;
            } elseif ($product->stock < $threshold) {
                $low++;
            }
        }

        return [
            'products' => count($products),
            'units' => $units,
            'retailValue' => $retailValue,
            'lowStock' => $low,
            'soldOut' => $soldOut,
            'threshold' => $threshold,
        ];
    }

    private function defaultReason(string $type): string
    {
        return match ($type) {
            'in' => 'Stock received',
            'out' => 'Stock removed',
            default => 'Stock correction',
        };
    }
}
