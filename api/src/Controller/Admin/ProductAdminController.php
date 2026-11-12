<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Service\ProductService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ProductAdminController
{
    public function __construct(private readonly ProductService $products)
    {
    }

    public function store(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();
        $body = is_array($body) ? $body : [];

        return Json::data($response, $this->products->create($body), 201);
    }

    /** @param array<string, string> $args */
    public function update(Request $request, Response $response, array $args): Response
    {
        $body = $request->getParsedBody();
        $body = is_array($body) ? $body : [];

        return Json::data($response, $this->products->update((string) ($args['id'] ?? ''), $body));
    }

    /** @param array<string, string> $args */
    public function destroy(Request $request, Response $response, array $args): Response
    {
        $this->products->delete((string) ($args['id'] ?? ''));

        return Json::data($response, ['deleted' => true]);
    }

    public function reset(Request $request, Response $response): Response
    {
        return Json::data($response, $this->products->reset());
    }
}
