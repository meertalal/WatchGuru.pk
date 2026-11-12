<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Order;
use Doctrine\ORM\EntityRepository;

/** @extends EntityRepository<Order> */
class OrderRepository extends EntityRepository
{
    /** @return list<Order> */
    public function all(): array
    {
        return $this->createQueryBuilder('o')
            ->orderBy('o.placedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByNumber(string $orderNumber): ?Order
    {
        return $this->findOneBy(['orderNumber' => mb_strtoupper(trim($orderNumber))]);
    }

    public function findByNumberAndEmail(string $orderNumber, string $email): ?Order
    {
        return $this->createQueryBuilder('o')
            ->where('UPPER(o.orderNumber) = :number')
            ->andWhere('LOWER(o.email) = :email')
            ->setParameter('number', mb_strtoupper(trim($orderNumber)))
            ->setParameter('email', mb_strtolower(trim($email)))
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function save(Order $order): void
    {
        $em = $this->getEntityManager();
        $em->persist($order);
        $em->flush();
    }

    public function numberExists(string $orderNumber): bool
    {
        return $this->count(['orderNumber' => $orderNumber]) > 0;
    }
}
