<?php

declare(strict_types=1);

use App\Controller\Admin\CouponAdminController;
use App\Controller\Admin\CustomerAdminController;
use App\Controller\Admin\InboxAdminController;
use App\Controller\Admin\OrderAdminController;
use App\Controller\Admin\ProductAdminController;
use App\Controller\Admin\StockAdminController;
use App\Controller\Admin\WarrantyAdminController;
use App\Controller\AuthController;
use App\Controller\ContactController;
use App\Controller\CouponController;
use App\Controller\HealthController;
use App\Controller\NewsletterController;
use App\Controller\OrderController;
use App\Controller\ProductController;
use App\Controller\WarrantyController;
use App\Middleware\AuthMiddleware;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return static function (App $app): void {
    $container = $app->getContainer();
    $auth = $container->get(AuthMiddleware::class);

    $app->get('/', fn (Request $request, Response $response): Response => Json::data($response, [
        'name' => 'WatchGuru.pk API',
        'version' => '1.0.0',
        'status' => 'ok',
    ]));

    $app->group('/api', function (RouteCollectorProxy $api) use ($auth): void {
        $api->get('/health', HealthController::class);

        /* Storefront — catalogue */
        $api->get('/products', [ProductController::class, 'index']);
        $api->get('/products/{slug}', [ProductController::class, 'show']);
        $api->get('/coupons/{code}', [CouponController::class, 'show']);

        /* Storefront — checkout & support */
        $api->post('/orders', [OrderController::class, 'place']);
        $api->get('/orders/track', [OrderController::class, 'track']);
        $api->post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe']);
        $api->post('/contact', [ContactController::class, 'store']);
        $api->get('/warranty/{serial}', [WarrantyController::class, 'show']);

        /* Admin authentication */
        $api->post('/auth/login', [AuthController::class, 'login']);
        $api->group('/auth', function (RouteCollectorProxy $session): void {
            $session->get('/me', [AuthController::class, 'me']);
            $session->post('/logout', [AuthController::class, 'logout']);
        })->add($auth);

        /* Admin — protected */
        $api->group('/admin', function (RouteCollectorProxy $admin): void {
            /* Orders */
            $admin->get('/orders', [OrderAdminController::class, 'index']);
            $admin->post('/orders', [OrderAdminController::class, 'store']);
            $admin->get('/orders/{orderNumber}', [OrderAdminController::class, 'show']);
            $admin->patch('/orders/{orderNumber}/status', [OrderAdminController::class, 'updateStatus']);

            /* Catalogue */
            $admin->post('/products', [ProductAdminController::class, 'store']);
            $admin->put('/products/{id}', [ProductAdminController::class, 'update']);
            $admin->delete('/products/{id}', [ProductAdminController::class, 'destroy']);
            $admin->post('/catalogue/reset', [ProductAdminController::class, 'reset']);

            /* Inventory */
            $admin->get('/stock', [StockAdminController::class, 'index']);
            $admin->get('/stock/movements', [StockAdminController::class, 'movements']);
            $admin->post('/stock/adjust', [StockAdminController::class, 'adjust']);

            /* Merchandising */
            $admin->get('/coupons', [CouponAdminController::class, 'index']);
            $admin->post('/coupons', [CouponAdminController::class, 'store']);
            $admin->put('/coupons/{id}', [CouponAdminController::class, 'update']);
            $admin->delete('/coupons/{id}', [CouponAdminController::class, 'destroy']);
            $admin->get('/customers', [CustomerAdminController::class, 'index']);

            /* Support */
            $admin->get('/warranty', [WarrantyAdminController::class, 'index']);
            $admin->post('/warranty', [WarrantyAdminController::class, 'store']);
            $admin->delete('/warranty/{id}', [WarrantyAdminController::class, 'destroy']);
            $admin->get('/contact', [InboxAdminController::class, 'contact']);
            $admin->delete('/contact/{id}', [InboxAdminController::class, 'destroyContact']);
            $admin->get('/newsletter', [InboxAdminController::class, 'newsletter']);
            $admin->delete('/newsletter/{id}', [InboxAdminController::class, 'destroySubscriber']);
        })->add($auth);
    });
};
