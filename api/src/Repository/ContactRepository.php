<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\ContactMessage;
use Doctrine\ORM\EntityRepository;

/** @extends EntityRepository<ContactMessage> */
class ContactRepository extends EntityRepository
{
    /** @return list<ContactMessage> */
    public function all(): array
    {
        return $this->createQueryBuilder('c')
            ->orderBy('c.createdAt', 'DESC')
            ->addOrderBy('c.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findById(int $id): ?ContactMessage
    {
        return $this->find($id);
    }

    public function save(ContactMessage $message): void
    {
        $em = $this->getEntityManager();
        $em->persist($message);
        $em->flush();
    }

    public function remove(ContactMessage $message): void
    {
        $em = $this->getEntityManager();
        $em->remove($message);
        $em->flush();
    }
}
