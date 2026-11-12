<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\StockMovement;
use Doctrine\ORM\EntityRepository;

/** @extends EntityRepository<StockMovement> */
class StockMovementRepository extends EntityRepository
{
    /** @return list<StockMovement> */
    public function all(?string $productId = null, int $limit = 100): array
    {
        $qb = $this->createQueryBuilder('m')
            ->orderBy('m.createdAt', 'DESC')
            ->addOrderBy('m.id', 'DESC')
            ->setMaxResults(max(1, min($limit, 500)));

        if ($productId !== null && trim($productId) !== '') {
            $qb->andWhere('m.productId = :productId')->setParameter('productId', trim($productId));
        }

        return $qb->getQuery()->getResult();
    }

    public function save(StockMovement $movement, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->persist($movement);

        if ($flush) {
            $em->flush();
        }
    }
}
