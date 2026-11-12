<?php

declare(strict_types=1);

namespace App\Controller;

use App\Service\NewsletterService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class NewsletterController
{
    public function __construct(private readonly NewsletterService $newsletter)
    {
    }

    public function unsubscribe(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();
        $body = is_array($body) ? $body : [];
        $email = isset($body['email']) && is_scalar($body['email']) ? (string) $body['email'] : '';

        return Json::data($response, $this->newsletter->unsubscribe($email));
    }
}
