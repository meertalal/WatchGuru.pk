<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\WarrantyService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class WarrantyController
{
    public function __construct(private readonly WarrantyService $warranty)
    {
    }

    /** @param array<string, string> $args */
    public function show(Request $request, Response $response, array $args): Response
    {
        return Json::data($response, $this->warranty->verify((string) ($args['serial'] ?? '')));
    }
}
