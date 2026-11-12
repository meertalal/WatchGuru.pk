<?php

declare(strict_types=1);

namespace App\Support;

use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Psr\Container\ContainerInterface;

/**
 * Builds Doctrine repositories for the DI container.
 *
 * Kept as a static method so PHP-DI's compiled container can reference it;
 * compiled definitions cannot capture closure variables.
 */
final class RepositoryFactory
{
    /**
     * @param class-string $entityClass
     * @param class-string<EntityRepository> $repositoryClass
     */
    public static function make(
        ContainerInterface $container,
        string $entityClass,
        string $repositoryClass,
    ): EntityRepository {
        $em = $container->get(EntityManagerInterface::class);

        return new $repositoryClass($em, $em->getClassMetadata($entityClass));
    }
}
