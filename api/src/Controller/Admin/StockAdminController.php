<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Service\StockService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class StockAdminController
{
    public function __construct(private readonly StockService $stock)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $productId = isset($params['productId']) && is_scalar($params['productId'])
            ? (string) $params['productId']
            : null;

        return Json::data($response, $this->stock->overview($productId));
    }

    public function movements(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $productId = isset($params['productId']) && is_scalar($params['productId'])
            ? (string) $params['productId']
            : null;

        return Json::data($response, $this->stock->movements($productId));
    }

    public function adjust(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();
        $body = is_array($body) ? $body : [];

        return Json::data($response, $this->stock->adjust($body), 201);
    }
}
