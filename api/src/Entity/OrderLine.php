<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'order_lines')]
class OrderLine
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Order::class, inversedBy: 'lines')]
    #[ORM\JoinColumn(name: 'order_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    public ?Order $order = null;

    #[ORM\Column(name: 'product_id', type: 'string', length: 40)]
    public string $productId = '';

    #[ORM\Column(type: 'string', length: 190)]
    public string $slug = '';

    #[ORM\Column(type: 'string', length: 190)]
    public string $name = '';

    #[ORM\Column(type: 'string', length: 120)]
    public string $brand = '';

    #[ORM\Column(type: 'integer')]
    public int $price = 0;

    #[ORM\Column(type: 'integer')]
    public int $quantity = 1;

    #[ORM\Column(type: 'text')]
    public string $image = '';
}
