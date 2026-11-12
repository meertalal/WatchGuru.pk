<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Support\ApiException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;

/**
 * Fixed-window rate limiter for the public API.
 *
 * A file-backed store is sufficient for this single-node deployment: each
 * bucket is a small JSON file guarded by flock(), so concurrent PHP workers
 * cannot race the counter. Buckets are keyed by client IP plus a coarse policy
 * name; the default policy is deliberately generous so normal browsing and
 * smoke tests are unaffected.
 */
final class RateLimitMiddleware implements MiddlewareInterface
{
    /** @var array<string, array{0:int, 1:int}> bucket => [limit, window in seconds] */
    private const POLICIES = [
        'login' => [15, 60],
        'orders' => [20, 60],
        'newsletter' => [10, 60],
        'contact' => [10, 60],
        'warranty' => [30, 60],
        'default' => [600, 60],
    ];

    public function __construct(
        private readonly string $storageDir,
        private readonly bool $enabled = true,
    ) {
    }

    public function process(Request $request, Handler $handler): Response
    {
        if (!$this->enabled || strtoupper($request->getMethod()) === 'OPTIONS') {
            return $handler->handle($request);
        }

        [$bucket, $limit, $window] = $this->policy($request);
        $ip = $request->getServerParams()['REMOTE_ADDR'] ?? 'unknown';

        if (!$this->consume($ip . '|' . $bucket, $limit, $window)) {
            throw ApiException::tooManyRequests(
                'Too many requests from this address. Please wait a moment and try again.',
            );
        }

        return $handler->handle($request);
    }

    /** @return array{0:string, 1:int, 2:int} */
    private function policy(Request $request): array
    {
        $method = strtoupper($request->getMethod());
        $path = rtrim($request->getUri()->getPath(), '/');

        if ($method === 'POST' && str_ends_with($path, '/auth/login')) {
            $bucket = 'login';
        } elseif ($method === 'POST' && str_ends_with($path, '/orders')) {
            $bucket = 'orders';
        } elseif ($method === 'POST' && str_ends_with($path, '/newsletter/unsubscribe')) {
            $bucket = 'newsletter';
        } elseif ($method === 'POST' && str_ends_with($path, '/contact')) {
            $bucket = 'contact';
        } elseif ($method === 'GET' && str_contains($path, '/warranty/')) {
            $bucket = 'warranty';
        } else {
            $bucket = 'default';
        }

        [$limit, $window] = self::POLICIES[$bucket];

        return [$bucket, $limit, $window];
    }

    private function consume(string $key, int $limit, int $window): bool
    {
        if (!is_dir($this->storageDir) && !mkdir($this->storageDir, 0775, true) && !is_dir($this->storageDir)) {
            // Fail open: a filesystem problem must not take checkout offline.
            return true;
        }

        $file = $this->storageDir . DIRECTORY_SEPARATOR . hash('sha256', $key) . '.json';
        $handle = @fopen($file, 'c+');

        if ($handle === false) {
            return true;
        }

        try {
            if (!flock($handle, LOCK_EX)) {
                return true;
            }

            $now = time();
            $raw = stream_get_contents($handle);
            $state = is_string($raw) && $raw !== '' ? json_decode($raw, true) : null;

            if (!is_array($state) || !isset($state['reset'], $state['count']) || (int) $state['reset'] <= $now) {
                $state = ['reset' => $now + $window, 'count' => 0];
            }

            $state['count'] = (int) $state['count'] + 1;
            $allowed = $state['count'] <= $limit;

            rewind($handle);
            ftruncate($handle, 0);
            fwrite($handle, (string) json_encode($state));
            fflush($handle);

            return $allowed;
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }
}
