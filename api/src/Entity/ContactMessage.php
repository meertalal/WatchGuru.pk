<?php

declare(strict_types=1);

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'contact_messages')]
class ContactMessage
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(type: 'string', length: 190)]
    public string $name = '';

    #[ORM\Column(type: 'string', length: 190)]
    public string $email = '';

    #[ORM\Column(type: 'string', length: 190)]
    public string $subject = '';

    #[ORM\Column(type: 'text')]
    public string $message = '';

    #[ORM\Column(name: 'created_at', type: 'datetime_immutable')]
    public DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }
}
