<?php

declare(strict_types=1);

namespace App\Controller\Admin;

use App\Service\ContactService;
use App\Service\NewsletterService;
use App\Support\Json;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class InboxAdminController
{
    public function __construct(
        private readonly ContactService $contact,
        private readonly NewsletterService $newsletter,
    ) {
    }

    public function contact(Request $request, Response $response): Response
    {
        return Json::data($response, $this->contact->list());
    }

    /** @param array<string, string> $args */
    public function destroyContact(Request $request, Response $response, array $args): Response
    {
        $this->contact->delete((int) ($args['id'] ?? 0));

        return Json::data($response, ['deleted' => true]);
    }

    public function newsletter(Request $request, Response $response): Response
    {
        return Json::data($response, $this->newsletter->list());
    }

    /** @param array<string, string> $args */
    public function destroySubscriber(Request $request, Response $response, array $args): Response
    {
        $this->newsletter->delete((int) ($args['id'] ?? 0));

        return Json::data($response, ['deleted' => true]);
    }
}
