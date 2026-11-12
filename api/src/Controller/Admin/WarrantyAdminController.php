<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Service\WarrantyService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class WarrantyAdminController
{
    public function __construct(private readonly WarrantyService $warranty)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        return Json::data($response, $this->warranty->list());
    }

    public function store(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();

        return Json::data($response, $this->warranty->create(is_array($body) ? $body : []), 201);
    }

    /** @param array<string, string> $args */
    public function destroy(Request $request, Response $response, array $args): Response
    {
        $this->warranty->delete((int) ($args['id'] ?? 0));

        return Json::data($response, ['deleted' => true]);
    }
}
