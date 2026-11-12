<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Service\CouponService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class CouponAdminController
{
    public function __construct(private readonly CouponService $coupons)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        return Json::data($response, $this->coupons->list());
    }

    public function store(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();

        return Json::data($response, $this->coupons->create(is_array($body) ? $body : []), 201);
    }

    /** @param array<string, string> $args */
    public function update(Request $request, Response $response, array $args): Response
    {
        $body = $request->getParsedBody();

        return Json::data(
            $response,
            $this->coupons->update((int) ($args['id'] ?? 0), is_array($body) ? $body : []),
        );
    }

    /** @param array<string, string> $args */
    public function destroy(Request $request, Response $response, array $args): Response
    {
        $this->coupons->delete((int) ($args['id'] ?? 0));

        return Json::data($response, ['deleted' => true]);
    }
}
