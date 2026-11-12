<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Product;
use App\Repository\ProductRepository;
use App\Support\ApiException;
use App\Support\Serializer;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Throwable;

final class ProductService
{
    private const CATEGORIES = ['men', 'women', 'unisex'];
    private const BADGES = ['new', 'sale', 'bestseller', 'limited'];

    public function __construct(
        private readonly ProductRepository $products,
        private readonly EntityManagerInterface $em,
    ) {
    }

    /** @return list<array<string, mixed>> */
    public function list(?string $search = null): array
    {
        return Serializer::products($this->products->all($search));
    }

    /** @return array<string, mixed> */
    public function getBySlug(string $slug): array
    {
        $product = $this->products->findBySlug($slug);

        if ($product === null) {
            throw ApiException::notFound('Product not found.');
        }

        return Serializer::product($product);
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    public function create(array $input): array
    {
        $product = new Product();
        $product->id = $this->stringOr($input, 'id') ?? $this->generateId();
        $this->apply($product, $input, true);
        $this->products->save($product);

        return Serializer::product($product);
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    public function update(string $id, array $input): array
    {
        $product = $this->products->findById($id);

        if ($product === null) {
            throw ApiException::notFound('Product not found.');
        }

        $this->apply($product, $input, false);
        $this->products->save($product);

        return Serializer::product($product);
    }

    public function delete(string $id): void
    {
        $product = $this->products->findById($id);

        if ($product === null) {
            throw ApiException::notFound('Product not found.');
        }

        $this->products->remove($product);
    }

    /** @return list<array<string, mixed>> */
    public function reset(): array
    {
        $seedPath = dirname(__DIR__, 2) . '/config/seeds/products.json';

        if (!is_file($seedPath)) {
            throw new \RuntimeException('Product seed file is missing.');
        }

        $raw = file_get_contents($seedPath);
        $rows = json_decode($raw === false ? '[]' : $raw, true);

        if (!is_array($rows)) {
            throw new \RuntimeException('Product seed file is invalid.');
        }

        $this->em->getConnection()->beginTransaction();

        try {
            $this->products->removeAll();

            foreach ($rows as $row) {
                if (!is_array($row)) {
                    continue;
                }

                $product = new Product();
                $product->id = (string) ($row['id'] ?? $this->generateId());
                $this->apply($product, $row, true);
                $this->em->persist($product);
            }

            $this->em->flush();
            $this->em->getConnection()->commit();
        } catch (Throwable $exception) {
            $this->em->getConnection()->rollBack();
            throw $exception;
        }

        return $this->list();
    }

    /** @param array<string, mixed> $input */
    private function apply(Product $product, array $input, bool $creating): void
    {
        $errors = [];

        $name = $this->stringOr($input, 'name') ?? ($creating ? null : $product->name);
        $brand = $this->stringOr($input, 'brand') ?? ($creating ? null : $product->brand);

        if ($name === null || $name === '') {
            $errors['name'] = 'Name is required.';
        }

        if ($brand === null || $brand === '') {
            $errors['brand'] = 'Brand is required.';
        }

        $slug = $this->stringOr($input, 'slug') ?? ($creating ? $this->slugify($name ?? '') : $product->slug);
        if ($slug === '') {
            $errors['slug'] = 'Slug is required.';
        }

        $existing = $this->products->findBySlug($slug);
        if ($existing !== null && $existing->id !== $product->id) {
            $errors['slug'] = 'That slug is already in use.';
        }

        $price = $this->intOr($input, 'price', $creating ? null : $product->price);
        if ($price === null || $price < 0) {
            $errors['price'] = 'Price must be a positive number.';
        }

        $category = $this->stringOr($input, 'category') ?? ($creating ? 'unisex' : $product->category);
        if (!in_array($category, self::CATEGORIES, true)) {
            $errors['category'] = 'Category must be men, women or unisex.';
        }

        $badge = array_key_exists('badge', $input)
            ? ($input['badge'] === null || $input['badge'] === '' ? null : (string) $input['badge'])
            : $product->badge;

        if ($badge !== null && !in_array($badge, self::BADGES, true)) {
            $errors['badge'] = 'Invalid badge.';
        }

        $stock = $this->intOr($input, 'stock', $creating ? 0 : $product->stock);
        if ($stock === null || $stock < 0) {
            $errors['stock'] = 'Stock must be zero or greater.';
        }

        if ($errors !== []) {
            throw ApiException::validation('Please check the product details.', $errors);
        }

        $product->name = (string) $name;
        $product->brand = (string) $brand;
        $product->slug = $slug;
        $product->price = (int) $price;
        $product->compareAtPrice = $this->nullableInt($input, 'compareAtPrice', $product->compareAtPrice);
        $product->description = $this->stringOr($input, 'description') ?? $product->description;
        $product->highlights = $this->stringList($input, 'highlights', $product->highlights);
        $product->images = $this->stringList($input, 'images', $product->images);
        $product->category = $category;
        $product->collections = $this->stringList($input, 'collections', $product->collections);
        $product->dialColor = $this->stringOr($input, 'dialColor') ?? $product->dialColor;
        $product->strapType = $this->stringOr($input, 'strapType') ?? $product->strapType;
        $product->caseMaterial = $this->stringOr($input, 'caseMaterial') ?? $product->caseMaterial;
        $product->caseSize = $this->stringOr($input, 'caseSize') ?? $product->caseSize;
        $product->movement = $this->stringOr($input, 'movement') ?? $product->movement;
        $product->features = $this->stringList($input, 'features', $product->features);
        $product->specs = $this->specList($input, 'specs', $product->specs);
        $product->variants = array_key_exists('variants', $input)
            ? (is_array($input['variants']) ? $input['variants'] : null)
            : $product->variants;
        $product->badge = $badge;
        $product->stock = (int) $stock;
        $product->inStock = array_key_exists('inStock', $input)
            ? (bool) $input['inStock'] && $product->stock > 0
            : $product->inStock && $product->stock > 0;
        $product->addedAt = $this->dateOr($input, 'addedAt', $product->addedAt);
    }

    /** @param array<string, mixed> $input */
    private function stringOr(array $input, string $key): ?string
    {
        if (!array_key_exists($key, $input) || !is_scalar($input[$key])) {
            return null;
        }

        $value = trim((string) $input[$key]);

        return $value === '' ? null : $value;
    }

    /** @param array<string, mixed> $input */
    private function intOr(array $input, string $key, ?int $fallback): ?int
    {
        if (!array_key_exists($key, $input)) {
            return $fallback;
        }

        if (!is_numeric($input[$key])) {
            return null;
        }

        return (int) $input[$key];
    }

    /** @param array<string, mixed> $input */
    private function nullableInt(array $input, string $key, ?int $fallback): ?int
    {
        if (!array_key_exists($key, $input)) {
            return $fallback;
        }

        if ($input[$key] === null || $input[$key] === '') {
            return null;
        }

        return is_numeric($input[$key]) ? max(0, (int) $input[$key]) : $fallback;
    }

    /** @param array<string, mixed> $input @param list<string> $fallback @return list<string> */
    private function stringList(array $input, string $key, array $fallback): array
    {
        if (!array_key_exists($key, $input) || !is_array($input[$key])) {
            return $fallback;
        }

        return array_values(array_map(static fn ($item): string => (string) $item, $input[$key]));
    }

    /** @param array<string, mixed> $input @param list<array{label: string, value: string}> $fallback @return list<array{label: string, value: string}> */
    private function specList(array $input, string $key, array $fallback): array
    {
        if (!array_key_exists($key, $input) || !is_array($input[$key])) {
            return $fallback;
        }

        $out = [];
        foreach ($input[$key] as $spec) {
            if (is_array($spec) && isset($spec['label'], $spec['value'])) {
                $out[] = ['label' => (string) $spec['label'], 'value' => (string) $spec['value']];
            }
        }

        return $out;
    }

    /** @param array<string, mixed> $input */
    private function dateOr(array $input, string $key, DateTimeImmutable $fallback): DateTimeImmutable
    {
        if (!array_key_exists($key, $input) || !is_string($input[$key]) || $input[$key] === '') {
            return $fallback;
        }

        try {
            return new DateTimeImmutable($input[$key]);
        } catch (Throwable) {
            return $fallback;
        }
    }

    private function generateId(): string
    {
        return 'p-' . bin2hex(random_bytes(6));
    }

    private function slugify(string $value): string
    {
        $slug = strtolower(trim($value));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';

        return trim($slug, '-');
    }
}
