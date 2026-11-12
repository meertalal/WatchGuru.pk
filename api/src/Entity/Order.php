<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\OrderRepository;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: 'orders')]
class Order
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(name: 'order_number', type: 'string', length: 30, unique: true)]
    public string $orderNumber = '';

    #[ORM\Column(name: 'placed_at', type: 'datetime_immutable')]
    public DateTimeImmutable $placedAt;

    #[ORM\Column(type: 'string', length: 190)]
    public string $email = '';

    #[ORM\Column(name: 'customer_name', type: 'string', length: 190)]
    public string $customerName = '';

    /** @var array<string, mixed> */
    #[ORM\Column(type: 'json')]
    public array $shipping = [];

    #[ORM\Column(type: 'integer')]
    public int $subtotal = 0;

    #[ORM\Column(name: 'shipping_cost', type: 'integer')]
    public int $shippingCost = 0;

    #[ORM\Column(type: 'integer')]
    public int $discount = 0;

    #[ORM\Column(type: 'integer')]
    public int $tax = 0;

    #[ORM\Column(type: 'integer')]
    public int $total = 0;

    #[ORM\Column(name: 'coupon_code', type: 'string', length: 40, nullable: true)]
    public ?string $couponCode = null;

    #[ORM\Column(name: 'payment_method', type: 'string', length: 30)]
    public string $paymentMethod = 'cod';

    #[ORM\Column(type: 'string', length: 30)]
    public string $status = 'processing';

    /** @var Collection<int, OrderLine> */
    #[ORM\OneToMany(targetEntity: OrderLine::class, mappedBy: 'order', cascade: ['persist'], orphanRemoval: true)]
    public Collection $lines;

    /** @var Collection<int, OrderStatusHistory> */
    #[ORM\OneToMany(targetEntity: OrderStatusHistory::class, mappedBy: 'order', cascade: ['persist'], orphanRemoval: true)]
    public Collection $statusHistory;

    public function __construct()
    {
        $this->placedAt = new DateTimeImmutable();
        $this->lines = new ArrayCollection();
        $this->statusHistory = new ArrayCollection();
    }
}
