<?php

declare(strict_types=1);

namespace App\Support;

use Doctrine\DBAL\DriverManager;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\ORMSetup;

final class Doctrine
{
    public static function createEntityManager(): EntityManagerInterface
    {
        $isDev = Env::bool('APP_DEBUG', false);

        $config = ORMSetup::createAttributeMetadataConfiguration(
            [dirname(__DIR__) . '/Entity'],
            $isDev,
        );

        $proxyDir = dirname(__DIR__, 2) . '/var/cache/doctrine/proxies';
        if (!is_dir($proxyDir) && !mkdir($proxyDir, 0777, true) && !is_dir($proxyDir)) {
            throw new \RuntimeException(sprintf('Unable to create proxy directory "%s".', $proxyDir));
        }

        $config->setProxyDir($proxyDir);
        $config->setProxyNamespace('App\\Proxies');

        $connection = DriverManager::getConnection([
            'driver' => 'pdo_mysql',
            'host' => Env::get('DB_HOST', '127.0.0.1'),
            'port' => Env::int('DB_PORT', 3306),
            'dbname' => Env::get('DB_NAME', 'watchguru'),
            'user' => Env::get('DB_USER', 'root'),
            'password' => Env::get('DB_PASSWORD', ''),
            'charset' => 'utf8mb4',
        ], $config);

        return new EntityManager($connection, $config);
    }
}
