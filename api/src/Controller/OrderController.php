<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\OrderService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class OrderController
{
    public function __construct(private readonly OrderService $orders)
    {
    }

    public function place(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();
        $body = is_array($body) ? $body : [];

        return Json::data($response, $this->orders->place($body), 201);
    }

    public function track(Request $request, Response $response): Response
    {
        $query = $request->getQueryParams();
        $number = isset($query['orderNumber']) && is_string($query['orderNumber']) ? $query['orderNumber'] : '';
        $email = isset($query['email']) && is_string($query['email']) ? $query['email'] : '';

        return Json::data($response, $this->orders->track($number, $email));
    }
}
