<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\NewsletterSubscriber;
use Doctrine\ORM\EntityRepository;

/** @extends EntityRepository<NewsletterSubscriber> */
class NewsletterRepository extends EntityRepository
{
    public function findByEmail(string $email): ?NewsletterSubscriber
    {
        return $this->findOneBy(['email' => mb_strtolower(trim($email))]);
    }

    /** @return list<NewsletterSubscriber> */
    public function all(): array
    {
        return $this->createQueryBuilder('n')
            ->orderBy('n.createdAt', 'DESC')
            ->addOrderBy('n.id', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findById(int $id): ?NewsletterSubscriber
    {
        return $this->find($id);
    }

    public function remove(NewsletterSubscriber $subscriber): void
    {
        $em = $this->getEntityManager();
        $em->remove($subscriber);
        $em->flush();
    }
}
