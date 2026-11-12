<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Service\OrderService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class OrderAdminController
{
    public function __construct(private readonly OrderService $orders)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        return Json::data($response, $this->orders->list());
    }

    /**
     * Manual order entry. Same validation, stock and totals as guest checkout.
     *
     * @param array<string, string> $args
     */
    public function store(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();
        $body = is_array($body) ? $body : [];

        $order = $this->orders->place($body);

        $status = isset($body['status']) && is_scalar($body['status'])
            ? strtolower(trim((string) $body['status']))
            : '';

        if ($status !== '' && $status !== 'processing') {
            $order = $this->orders->updateStatus(
                (string) $order['orderNumber'],
                $status,
                'Order entered by the store team',
            );
        }

        return Json::data($response, $order, 201);
    }

    /** @param array<string, string> $args */
    public function show(Request $request, Response $response, array $args): Response
    {
        return Json::data($response, $this->orders->get((string) ($args['orderNumber'] ?? '')));
    }

    /** @param array<string, string> $args */
    public function updateStatus(Request $request, Response $response, array $args): Response
    {
        $body = $request->getParsedBody();
        $body = is_array($body) ? $body : [];
        $status = isset($body['status']) && is_scalar($body['status']) ? (string) $body['status'] : '';
        $note = isset($body['note']) && is_scalar($body['note']) ? (string) $body['note'] : null;

        return Json::data(
            $response,
            $this->orders->updateStatus((string) ($args['orderNumber'] ?? ''), $status, $note),
        );
    }
}
