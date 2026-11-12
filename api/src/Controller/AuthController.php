<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Account;
use App\Service\AuthService;
use App\Support\ApiException;
use App\Support\Json;
use App\Support\Serializer;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AuthController
{
    public function __construct(private readonly AuthService $auth)
    {
    }

    public function login(Request $request, Response $response): Response
    {
        $body = $request->getParsedBody();
        $body = is_array($body) ? $body : [];

        $email = isset($body['email']) && is_scalar($body['email']) ? (string) $body['email'] : '';
        $password = isset($body['password']) && is_scalar($body['password']) ? (string) $body['password'] : '';

        return Json::data($response, $this->auth->login($email, $password));
    }

    public function me(Request $request, Response $response): Response
    {
        $account = $request->getAttribute('account');

        if (!$account instanceof Account) {
            throw ApiException::unauthorized();
        }

        return Json::data($response, Serializer::account($account));
    }

    public function logout(Request $request, Response $response): Response
    {
        $token = $request->getAttribute('auth_token');

        if (is_string($token) && $token !== '') {
            $this->auth->logout($token);
        }

        return Json::data($response, ['loggedOut' => true]);
    }
}
