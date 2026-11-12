<?php

declare(strict_types=1);

namespace App\Support;

use Psr\Http\Message\ResponseInterface as Response;

final class Json
{
    /** @param mixed $data */
    public static function data(Response $response, $data, int $status = 200): Response
    {
        return self::write($response, ['data' => $data], $status);
    }

    /** @param array<string, mixed> $fields */
    public static function error(
        Response $response,
        string $code,
        string $message,
        int $status,
        array $fields = [],
    ): Response {
        $error = ['code' => $code, 'message' => $message];

        if ($fields !== []) {
            $error['fields'] = $fields;
        }

        return self::write($response, ['error' => $error], $status);
    }

    /** @param array<string, mixed> $payload */
    private static function write(Response $response, array $payload, int $status): Response
    {
        $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if ($json === false) {
            $json = '{"error":{"code":"SERVER_ERROR","message":"Unable to encode response."}}';
            $status = 500;
        }

        $response->getBody()->write($json);

        return $response
            ->withHeader('Content-Type', 'application/json; charset=utf-8')
            ->withStatus($status);
    }
}
