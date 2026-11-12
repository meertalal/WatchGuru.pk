<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Slim\Psr7\Response as SlimResponse;

final class CorsMiddleware implements MiddlewareInterface
{
    /** @param list<string> $allowedOrigins */
    public function __construct(private readonly array $allowedOrigins)
    {
    }

    public function process(Request $request, Handler $handler): Response
    {
        $origin = $request->getHeaderLine('Origin');
        $allowed = $this->allowedOrigin($origin);

        $response = strtoupper($request->getMethod()) === 'OPTIONS'
            ? new SlimResponse(204)
            : $handler->handle($request);

        if ($allowed !== null) {
            $response = $response
                ->withHeader('Access-Control-Allow-Origin', $allowed)
                ->withHeader('Vary', 'Origin');
        }

        return $response
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, Accept, Origin, X-Admin-Token')
            ->withHeader('Access-Control-Max-Age', '86400');
    }

    private function allowedOrigin(string $origin): ?string
    {
        if ($this->allowedOrigins === [] || in_array('*', $this->allowedOrigins, true)) {
            return $origin !== '' ? $origin : '*';
        }

        return in_array($origin, $this->allowedOrigins, true) ? $origin : null;
    }
}
