<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\Json;
use PHPUnit\Framework\TestCase;
use Slim\Psr7\Response;

final class JsonTest extends TestCase
{
    public function testDataWrapsPayloadInDataEnvelope(): void
    {
        $response = Json::data($this->response(), ['id' => 'tc-001'], 201);

        self::assertSame(201, $response->getStatusCode());
        self::assertSame('application/json; charset=utf-8', $response->getHeaderLine('Content-Type'));
        self::assertSame('{"data":{"id":"tc-001"}}', (string) $response->getBody());
    }

    public function testErrorEnvelopeIncludesFieldsWhenPresent(): void
    {
        $response = Json::error(
            $this->response(),
            'VALIDATION_ERROR',
            'Invalid.',
            422,
            ['email' => 'Required.'],
        );

        self::assertSame(422, $response->getStatusCode());
        self::assertSame(
            '{"error":{"code":"VALIDATION_ERROR","message":"Invalid.","fields":{"email":"Required."}}}',
            (string) $response->getBody(),
        );
    }

    public function testErrorEnvelopeOmitsEmptyFields(): void
    {
        $response = Json::error($this->response(), 'NOT_FOUND', 'Missing.', 404);

        self::assertSame('{"error":{"code":"NOT_FOUND","message":"Missing."}}', (string) $response->getBody());
    }

    private function response(): Response
    {
        return new Response();
    }
}
