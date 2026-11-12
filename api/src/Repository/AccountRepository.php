<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Account;
use Doctrine\ORM\EntityRepository;

/** @extends EntityRepository<Account> */
class AccountRepository extends EntityRepository
{
    public function findByEmail(string $email): ?Account
    {
        return $this->findOneBy(['email' => mb_strtolower(trim($email))]);
    }

    public function findById(int $id): ?Account
    {
        return $this->find($id);
    }

    public function save(Account $account): void
    {
        $em = $this->getEntityManager();
        $em->persist($account);
        $em->flush();
    }
}
