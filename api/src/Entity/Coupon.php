<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\CouponRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CouponRepository::class)]
#[ORM\Table(name: 'coupons')]
class Coupon
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(type: 'string', length: 40, unique: true)]
    public string $code = '';

    #[ORM\Column(type: 'string', length: 20)]
    public string $type = 'percent';

    #[ORM\Column(type: 'integer')]
    public int $value = 0;

    #[ORM\Column(type: 'string', length: 190)]
    public string $label = '';

    #[ORM\Column(type: 'boolean')]
    public bool $active = true;
}
