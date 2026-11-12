<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\AdminToken;
use DateTimeImmutable;
use Doctrine\ORM\EntityRepository;

/** @extends EntityRepository<AdminToken> */
class AdminTokenRepository extends EntityRepository
{
    public function findByTokenHash(string $tokenHash): ?AdminToken
    {
        return $this->findOneBy(['tokenHash' => $tokenHash]);
    }

    public function save(AdminToken $token): void
    {
        $em = $this->getEntityManager();
        $em->persist($token);
        $em->flush();
    }

    public function remove(AdminToken $token): void
    {
        $em = $this->getEntityManager();
        $em->remove($token);
        $em->flush();
    }

    public function removeExpired(): void
    {
        $this->createQueryBuilder('t')
            ->delete()
            ->where('t.expiresAt < :now')
            ->setParameter('now', new DateTimeImmutable())
            ->getQuery()
            ->execute();
    }
}
