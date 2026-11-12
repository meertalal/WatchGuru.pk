<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Service\CustomerService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class CustomerAdminController
{
    public function __construct(private readonly CustomerService $customers)
    {
    }

    public function index(Request $request, Response $response): Response
    {
        return Json::data($response, $this->customers->list());
    }
}
