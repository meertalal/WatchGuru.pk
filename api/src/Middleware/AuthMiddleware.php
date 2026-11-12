<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Service\AuthService;
use App\Support\ApiException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;

final class AuthMiddleware implements MiddlewareInterface
{
    public function __construct(private readonly AuthService $auth)
    {
    }

    public function process(Request $request, Handler $handler): Response
    {
        $token = $this->extractToken($request);

        if ($token === null) {
            throw ApiException::unauthorized('An admin token is required.');
        }

        $account = $this->auth->resolveAccount($token);

        if ($account === null) {
            throw ApiException::unauthorized('Your session has expired. Please sign in again.');
        }

        return $handler->handle(
            $request
                ->withAttribute('account', $account)
                ->withAttribute('auth_token', $token),
        );
    }

    private function extractToken(Request $request): ?string
    {
        $header = trim($request->getHeaderLine('Authorization'));

        if ($header !== '') {
            if (preg_match('/^Bearer\s+(.+)$/i', $header, $matches) === 1) {
                return trim($matches[1]);
            }

            return $header;
        }

        $token = trim($request->getHeaderLine('X-Admin-Token'));

        return $token !== '' ? $token : null;
    }
}
