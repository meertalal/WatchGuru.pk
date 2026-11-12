<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Support\Token;
use PHPUnit\Framework\TestCase;

final class TokenTest extends TestCase
{
    public function testGenerateReturnsSixtyFourHexCharacters(): void
    {
        $token = Token::generate();

        self::assertSame(64, strlen($token));
        self::assertMatchesRegularExpression('/^[0-9a-f]{64}$/', $token);
    }

    public function testGenerateIsRandom(): void
    {
        self::assertNotSame(Token::generate(), Token::generate());
    }

    public function testHashIsSha256OfThePlainToken(): void
    {
        $plain = 'example-token';

        self::assertSame(hash('sha256', $plain), Token::hash($plain));
        self::assertSame(64, strlen(Token::hash($plain)));
    }
}
