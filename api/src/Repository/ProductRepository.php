<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Product;
use Doctrine\ORM\EntityRepository;

/** @extends EntityRepository<Product> */
class ProductRepository extends EntityRepository
{
    /** @return list<Product> */
    public function all(?string $search = null): array
    {
        $qb = $this->createQueryBuilder('p')->orderBy('p.addedAt', 'DESC')->addOrderBy('p.name', 'ASC');

        if ($search !== null && trim($search) !== '') {
            $needle = '%' . mb_strtolower(trim($search)) . '%';
            $qb->andWhere(
                'LOWER(p.name) LIKE :needle OR LOWER(p.brand) LIKE :needle OR LOWER(p.slug) LIKE :needle',
            )->setParameter('needle', $needle);
        }

        return $qb->getQuery()->getResult();
    }

    public function findBySlug(string $slug): ?Product
    {
        return $this->findOneBy(['slug' => $slug]);
    }

    public function findById(string $id): ?Product
    {
        return $this->find($id);
    }

    public function save(Product $product, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->persist($product);

        if ($flush) {
            $em->flush();
        }
    }

    public function remove(Product $product, bool $flush = true): void
    {
        $em = $this->getEntityManager();
        $em->remove($product);

        if ($flush) {
            $em->flush();
        }
    }

    public function removeAll(): void
    {
        $this->getEntityManager()
            ->createQuery('DELETE FROM App\\Entity\\Product p')
            ->execute();
    }

    public function countAll(): int
    {
        return (int) $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->getQuery()
            ->getSingleScalarResult();
    }
}
