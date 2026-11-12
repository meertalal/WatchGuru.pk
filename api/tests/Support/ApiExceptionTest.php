<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\ApiException;
use PHPUnit\Framework\TestCase;

final class ApiExceptionTest extends TestCase
{
    public function testNotFound(): void
    {
        $exception = ApiException::notFound('Product not found.');

        self::assertSame(404, $exception->status);
        self::assertSame('NOT_FOUND', $exception->errorCode);
        self::assertSame('Product not found.', $exception->getMessage());
        self::assertSame([], $exception->fields);
    }

    public function testValidationCarriesFieldErrors(): void
    {
        $exception = ApiException::validation('Invalid.', ['email' => 'Required.']);

        self::assertSame(422, $exception->status);
        self::assertSame('VALIDATION_ERROR', $exception->errorCode);
        self::assertSame(['email' => 'Required.'], $exception->fields);
    }

    public function testUnauthorized(): void
    {
        $exception = ApiException::unauthorized();

        self::assertSame(401, $exception->status);
        self::assertSame('UNAUTHENTICATED', $exception->errorCode);
    }
}
