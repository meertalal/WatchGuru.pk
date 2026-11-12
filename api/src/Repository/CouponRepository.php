<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Coupon;
use Doctrine\ORM\EntityRepository;

/** @extends EntityRepository<Coupon> */
class CouponRepository extends EntityRepository
{
    public function findByCode(string $code): ?Coupon
    {
        return $this->findOneBy(['code' => mb_strtoupper(trim($code))]);
    }

    /** @return list<Coupon> */
    public function all(): array
    {
        return $this->createQueryBuilder('c')->orderBy('c.code', 'ASC')->getQuery()->getResult();
    }

    public function save(Coupon $coupon, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->persist($coupon);

        if ($flush) {
            $em->flush();
        }
    }

    public function remove(Coupon $coupon): void
    {
        $em = $this->getEntityManager();
        $em->remove($coupon);
        $em->flush();
    }
}
