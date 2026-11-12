<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\ProductService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ProductController
{
    public function __construct(private readonly ProductService $products)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        $query = $request->getQueryParams();
        $search = isset($query['search']) && is_string($query['search']) ? $query['search'] : null;

        return Json::data($response, $this->products->list($search));
    }

    /** @param array<string, string> $args */
    public function show(Request $request, Response $response, array $args): Response
    {
        return Json::data($response, $this->products->getBySlug((string) ($args['slug'] ?? '')));
    }
}
