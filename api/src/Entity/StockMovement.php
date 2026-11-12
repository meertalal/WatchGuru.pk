<?php

declare(strict_types=1);

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

/**
 * One immutable entry in the inventory ledger. Every stock change handled by
 * the stock module records a movement so the balance can always be explained.
 */
#[ORM\Entity]
#[ORM\Table(name: 'stock_movements')]
class StockMovement
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(name: 'product_id', type: 'string', length: 40)]
    public string $productId = '';

    #[ORM\Column(name: 'product_name', type: 'string', length: 190)]
    public string $productName = '';

    /** in | out | correction */
    #[ORM\Column(type: 'string', length: 20)]
    public string $type = 'in';

    /** Signed change applied to the product's stock level. */
    #[ORM\Column(type: 'integer')]
    public int $quantity = 0;

    #[ORM\Column(name: 'balance_after', type: 'integer')]
    public int $balanceAfter = 0;

    #[ORM\Column(type: 'string', length: 190)]
    public string $reason = '';

    #[ORM\Column(type: 'string', length: 60, nullable: true)]
    public ?string $reference = null;

    #[ORM\Column(name: 'created_at', type: 'datetime_immutable')]
    public DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }
}
