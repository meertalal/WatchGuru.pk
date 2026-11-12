<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\CouponService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class CouponController
{
    public function __construct(private readonly CouponService $coupons)
    {
    }

    /** @param array<string, string> $args */
    public function show(Request $request, Response $response, array $args): Response
    {
        return Json::data($response, $this->coupons->findByCode((string) ($args['code'] ?? '')));
    }
}
