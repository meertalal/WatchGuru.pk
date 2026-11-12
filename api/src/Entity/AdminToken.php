<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\AdminTokenRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AdminTokenRepository::class)]
#[ORM\Table(name: 'admin_tokens')]
#[ORM\Index(name: 'idx_admin_tokens_account', columns: ['account_id'])]
class AdminToken
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    public ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Account::class)]
    #[ORM\JoinColumn(name: 'account_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    public ?Account $account = null;

    #[ORM\Column(name: 'token_hash', type: 'string', length: 64, unique: true)]
    public string $tokenHash = '';

    #[ORM\Column(name: 'expires_at', type: 'datetime_immutable')]
    public DateTimeImmutable $expiresAt;

    #[ORM\Column(name: 'created_at', type: 'datetime_immutable')]
    public DateTimeImmutable $createdAt;

    public function __construct()
    {
        $now = new DateTimeImmutable();
        $this->createdAt = $now;
        $this->expiresAt = $now;
    }
}
