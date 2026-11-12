<?php

declare(strict_types=1);

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'warranty_serials')]
class WarrantySerial
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(type: 'string', length: 60, unique: true)]
    public string $serial = '';

    #[ORM\Column(name: 'product_id', type: 'string', length: 40, nullable: true)]
    public ?string $productId = null;

    #[ORM\Column(name: 'verified_at', type: 'datetime_immutable', nullable: true)]
    public ?DateTimeImmutable $verifiedAt = null;

    #[ORM\Column(name: 'created_at', type: 'datetime_immutable')]
    public DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }
}
