<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\ContactService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ContactController
{
    public function __construct(private readonly ContactService $contact)
    {
    }

    public function store(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();
        $body = is_array($body) ? $body : [];

        return Json::data($response, $this->contact->send($body), 201);
    }
}
