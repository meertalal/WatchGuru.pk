<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\AccountRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AccountRepository::class)]
#[ORM\Table(name: 'accounts')]
class Account
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\Column(type: 'string', length: 190, unique: true)]
    public string $email = '';

    #[ORM\Column(name: 'first_name', type: 'string', length: 100)]
    public string $firstName = '';

    #[ORM\Column(name: 'last_name', type: 'string', length: 100)]
    public string $lastName = '';

    #[ORM\Column(type: 'string', length: 40)]
    public string $phone = '';

    #[ORM\Column(name: 'password_hash', type: 'string', length: 255)]
    public string $passwordHash = '';

    #[ORM\Column(type: 'string', length: 20)]
    public string $role = 'admin';

    #[ORM\Column(name: 'created_at', type: 'datetime_immutable')]
    public DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }
}
