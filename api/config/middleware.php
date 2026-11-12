<?php

declare(strict_types=1);

use App\Middleware\CorsMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Support\ApiErrorHandler;
use App\Support\Env;
use Psr\Log\LoggerInterface;
use Slim\App;

return static function (App $app): void {
    $container = $app->getContainer();
    $debug = Env::bool('APP_DEBUG', false);

    $app->addBodyParsingMiddleware();
    $app->addRoutingMiddleware();

    // Inside the error middleware so a 429 is rendered through the normal
    // error envelope; CORS is added last and therefore wraps everything.
    $app->add($container->get(RateLimitMiddleware::class));

    $errorMiddleware = $app->addErrorMiddleware(
        $debug,
        true,
        true,
        $container->get(LoggerInterface::class),
    );

    $errorMiddleware->setDefaultErrorHandler(new ApiErrorHandler(
        $app->getCallableResolver(),
        $app->getResponseFactory(),
        $container->get(LoggerInterface::class),
    ));

    // Added last so it wraps the error middleware and CORS headers reach error responses too.
    $app->add($container->get(CorsMiddleware::class));
};
