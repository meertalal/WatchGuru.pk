<?php

declare(strict_types=1);

use App\Support\Env;
use DI\ContainerBuilder;
use Slim\App;
use Slim\Factory\AppFactory;

require dirname(__DIR__) . '/vendor/autoload.php';

Env::load(dirname(__DIR__) . '/.env');

$builder = new ContainerBuilder();
$builder->useAutowiring(true);

(require dirname(__DIR__) . '/config/dependencies.php')($builder);

if (!Env::bool('APP_DEBUG', false)) {
    $cacheDir = dirname(__DIR__) . '/var/cache/container';

    if (!is_dir($cacheDir) && !mkdir($cacheDir, 0777, true) && !is_dir($cacheDir)) {
        throw new RuntimeException(sprintf('Unable to create container cache directory "%s".', $cacheDir));
    }

    $builder->enableCompilation($cacheDir);
}

$container = $builder->build();

AppFactory::setContainer($container);
$app = AppFactory::create();

(require dirname(__DIR__) . '/config/middleware.php')($app);
(require dirname(__DIR__) . '/config/routes.php')($app);

return $app;
