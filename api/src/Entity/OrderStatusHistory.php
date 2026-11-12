<?php

declare(strict_types=1);

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'order_status_history')]
class OrderStatusHistory
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Order::class, inversedBy: 'statusHistory')]
    #[ORM\JoinColumn(name: 'order_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    public ?Order $order = null;

    #[ORM\Column(type: 'string', length: 30)]
    public string $status = 'processing';

    #[ORM\Column(name: 'changed_at', type: 'datetime_immutable')]
    public DateTimeImmutable $at;

    #[ORM\Column(type: 'text', nullable: true)]
    public ?string $note = null;

    public function __construct()
    {
        $this->at = new DateTimeImmutable();
    }
}
