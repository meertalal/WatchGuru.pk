<?php

declare(strict_types=1);

namespace App\Controller;

use App\Support\Json;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class HealthController
{
    public function __construct(private readonly EntityManagerInterface $em)
    {
    }

    public function __invoke(Request $request, Response $response): Response
    {
        $this->em->getConnection()->executeQuery('SELECT 1');

        return Json::data($response, [
            'status' => 'ok',
            'database' => 'ok',
            'time' => (new \DateTimeImmutable())->format(DATE_ATOM),
        ]);
    }
}
