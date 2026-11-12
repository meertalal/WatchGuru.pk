<?php

declare(strict_types=1);

use App\Entity\Account;
use App\Entity\AdminToken;
use App\Entity\ContactMessage;
use App\Entity\Coupon;
use App\Entity\NewsletterSubscriber;
use App\Entity\Order;
use App\Entity\Product;
use App\Entity\StockMovement;
use App\Entity\WarrantySerial;
use App\Middleware\CorsMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Repository\AccountRepository;
use App\Repository\AdminTokenRepository;
use App\Repository\ContactRepository;
use App\Repository\CouponRepository;
use App\Repository\NewsletterRepository;
use App\Repository\OrderRepository;
use App\Repository\ProductRepository;
use App\Repository\StockMovementRepository;
use App\Repository\WarrantyRepository;
use App\Support\Doctrine;
use App\Support\Env;
use App\Support\RepositoryFactory;
use DI\ContainerBuilder;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Monolog\Handler\StreamHandler;
use Monolog\Logger;
use Psr\Container\ContainerInterface;
use Psr\Log\LoggerInterface;

return static function (ContainerBuilder $builder): void {
    $builder->addDefinitions([
        LoggerInterface::class => static function (): LoggerInterface {
            $logDir = dirname(__DIR__) . '/logs';

            if (!is_dir($logDir) && !mkdir($logDir, 0777, true) && !is_dir($logDir)) {
                throw new RuntimeException(sprintf('Unable to create log directory "%s".', $logDir));
            }

            return new Logger('watchguru', [
                new StreamHandler($logDir . '/app.log', Logger::DEBUG),
            ]);
        },

        EntityManagerInterface::class => static fn (): EntityManagerInterface => Doctrine::createEntityManager(),

        ProductRepository::class => static fn (ContainerInterface $c): EntityRepository => RepositoryFactory::make(
            $c,
            Product::class,
            ProductRepository::class,
        ),
        AccountRepository::class => static fn (ContainerInterface $c): EntityRepository => RepositoryFactory::make(
            $c,
            Account::class,
            AccountRepository::class,
        ),
        AdminTokenRepository::class => static fn (ContainerInterface $c): EntityRepository => RepositoryFactory::make(
            $c,
            AdminToken::class,
            AdminTokenRepository::class,
        ),
        OrderRepository::class => static fn (ContainerInterface $c): EntityRepository => RepositoryFactory::make(
            $c,
            Order::class,
            OrderRepository::class,
        ),
        CouponRepository::class => static fn (ContainerInterface $c): EntityRepository => RepositoryFactory::make(
            $c,
            Coupon::class,
            CouponRepository::class,
        ),
        NewsletterRepository::class => static fn (ContainerInterface $c): EntityRepository => RepositoryFactory::make(
            $c,
            NewsletterSubscriber::class,
            NewsletterRepository::class,
        ),
        ContactRepository::class => static fn (ContainerInterface $c): EntityRepository => RepositoryFactory::make(
            $c,
            ContactMessage::class,
            ContactRepository::class,
        ),
        WarrantyRepository::class => static fn (ContainerInterface $c): EntityRepository => RepositoryFactory::make(
            $c,
            WarrantySerial::class,
            WarrantyRepository::class,
        ),
        StockMovementRepository::class => static fn (ContainerInterface $c): EntityRepository => RepositoryFactory::make(
            $c,
            StockMovement::class,
            StockMovementRepository::class,
        ),

        CorsMiddleware::class => static fn (): CorsMiddleware => new CorsMiddleware(
            Env::csv('CORS_ORIGINS', ['http://localhost:5173', 'http://127.0.0.1:5173']),
        ),

        RateLimitMiddleware::class => static fn (): RateLimitMiddleware => new RateLimitMiddleware(
            dirname(__DIR__) . '/var/rate-limit',
            Env::bool('RATE_LIMIT_ENABLED', true),
        ),
    ]);
};
