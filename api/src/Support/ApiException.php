<?php

declare(strict_types=1);

namespace App\Support;

use RuntimeException;

class ApiException extends RuntimeException
{
    /** @param array<string, string> $fields */
    public function __construct(
        public readonly int $status,
        public readonly string $errorCode,
        string $message,
        public readonly array $fields = [],
    ) {
        parent::__construct($message);
    }

    public static function notFound(string $message = 'Resource not found.'): self
    {
        return new self(404, 'NOT_FOUND', $message);
    }

    /** @param array<string, string> $fields */
    public static function validation(string $message = 'The given data was invalid.', array $fields = []): self
    {
        return new self(422, 'VALIDATION_ERROR', $message, $fields);
    }

    public static function unauthorized(string $message = 'Authentication required.'): self
    {
        return new self(401, 'UNAUTHENTICATED', $message);
    }

    public static function forbidden(string $message = 'You do not have permission to perform this action.'): self
    {
        return new self(403, 'INSUFFICIENT_PRIVILEGES', $message);
    }

    public static function conflict(string $message = 'The request conflicts with the current state.'): self
    {
        return new self(409, 'CONFLICT', $message);
    }

    public static function badRequest(string $message = 'Bad request.'): self
    {
        return new self(400, 'BAD_REQUEST', $message);
    }

    public static function tooManyRequests(string $message = 'Too many requests. Please try again later.'): self
    {
        return new self(429, 'TOO_MANY_REQUESTS', $message);
    }
}
