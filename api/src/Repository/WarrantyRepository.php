<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\WarrantySerial;
use Doctrine\ORM\EntityRepository;

/** @extends EntityRepository<WarrantySerial> */
class WarrantyRepository extends EntityRepository
{
    public function findBySerial(string $serial): ?WarrantySerial
    {
        return $this->findOneBy(['serial' => mb_strtoupper(trim($serial))]);
    }

    /** @return list<WarrantySerial> */
    public function all(): array
    {
        return $this->createQueryBuilder('w')
            ->orderBy('w.createdAt', 'DESC')
            ->addOrderBy('w.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findById(int $id): ?WarrantySerial
    {
        return $this->find($id);
    }

    public function save(WarrantySerial $serial): void
    {
        $em = $this->getEntityManager();
        $em->persist($serial);
        $em->flush();
    }

    public function remove(WarrantySerial $serial): void
    {
        $em = $this->getEntityManager();
        $em->remove($serial);
        $em->flush();
    }
}
