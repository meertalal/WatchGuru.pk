<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Account;
use App\Entity\AdminToken;
use App\Repository\AccountRepository;
use App\Repository\AdminTokenRepository;
use App\Support\ApiException;
use App\Support\Env;
use App\Support\Serializer;
use App\Support\Token;
use DateTimeImmutable;

final class AuthService
{
    public function __construct(
        private readonly AccountRepository $accounts,
        private readonly AdminTokenRepository $tokens,
    ) {
    }

    /** @return array{token: string, expiresAt: string, account: array<string, mixed>} */
    public function login(string $email, string $password): array
    {
        $errors = [];

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Enter a valid email address.';
        }

        if (strlen($password) < 6) {
            $errors['password'] = 'Password must be at least 6 characters.';
        }

        if ($errors !== []) {
            throw ApiException::validation('Please check your credentials.', $errors);
        }

        $account = $this->accounts->findByEmail($email);

        if ($account === null || !password_verify($password, $account->passwordHash)) {
            throw ApiException::unauthorized('Incorrect email or password. Please try again.');
        }

        $this->tokens->removeExpired();

        $plain = Token::generate();
        $ttlDays = max(1, Env::int('ADMIN_TOKEN_TTL_DAYS', 7));

        $token = new AdminToken();
        $token->account = $account;
        $token->tokenHash = Token::hash($plain);
        $token->expiresAt = (new DateTimeImmutable())->modify(sprintf('+%d days', $ttlDays));
        $this->tokens->save($token);

        return [
            'token' => $plain,
            'expiresAt' => $token->expiresAt->format(DATE_ATOM),
            'account' => Serializer::account($account),
        ];
    }

    public function logout(string $plainToken): void
    {
        $token = $this->tokens->findByTokenHash(Token::hash($plainToken));

        if ($token !== null) {
            $this->tokens->remove($token);
        }
    }

    public function resolveAccount(string $plainToken): ?Account
    {
        $token = $this->tokens->findByTokenHash(Token::hash($plainToken));

        if ($token === null) {
            return null;
        }

        if ($token->expiresAt < new DateTimeImmutable()) {
            $this->tokens->remove($token);

            return null;
        }

        return $token->account;
    }
}
