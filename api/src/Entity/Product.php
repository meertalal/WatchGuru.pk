<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ProductRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ORM\Table(name: 'products')]
class Product
{
    #[ORM\Id, ORM\Column(type: 'string', length: 40)]
    public string $id = '';

    #[ORM\Column(type: 'string', length: 190, unique: true)]
    public string $slug = '';

    #[ORM\Column(type: 'string', length: 190)]
    public string $name = '';

    #[ORM\Column(type: 'string', length: 120)]
    public string $brand = '';

    #[ORM\Column(type: 'integer')]
    public int $price = 0;

    #[ORM\Column(name: 'compare_at_price', type: 'integer', nullable: true)]
    public ?int $compareAtPrice = null;

    #[ORM\Column(type: 'text')]
    public string $description = '';

    /** @var list<string> */
    #[ORM\Column(type: 'json')]
    public array $highlights = [];

    /** @var list<string> */
    #[ORM\Column(type: 'json')]
    public array $images = [];

    #[ORM\Column(type: 'string', length: 20)]
    public string $category = 'unisex';

    /** @var list<string> */
    #[ORM\Column(type: 'json')]
    public array $collections = [];

    #[ORM\Column(name: 'dial_color', type: 'string', length: 40)]
    public string $dialColor = '';

    #[ORM\Column(name: 'strap_type', type: 'string', length: 40)]
    public string $strapType = '';

    #[ORM\Column(name: 'case_material', type: 'string', length: 80)]
    public string $caseMaterial = '';

    #[ORM\Column(name: 'case_size', type: 'string', length: 40)]
    public string $caseSize = '';

    #[ORM\Column(type: 'string', length: 80)]
    public string $movement = '';

    /** @var list<string> */
    #[ORM\Column(type: 'json')]
    public array $features = [];

    /** @var list<array{label: string, value: string}> */
    #[ORM\Column(type: 'json')]
    public array $specs = [];

    /** @var list<array<string, mixed>>|null */
    #[ORM\Column(type: 'json', nullable: true)]
    public ?array $variants = null;

    #[ORM\Column(type: 'string', length: 20, nullable: true)]
    public ?string $badge = null;

    #[ORM\Column(name: 'in_stock', type: 'boolean')]
    public bool $inStock = true;

    #[ORM\Column(type: 'integer')]
    public int $stock = 0;

    #[ORM\Column(name: 'added_at', type: 'datetime_immutable')]
    public DateTimeImmutable $addedAt;

    public function __construct()
    {
        $this->addedAt = new DateTimeImmutable();
    }
}
