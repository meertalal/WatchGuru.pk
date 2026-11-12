<?php

declare(strict_types=1);

namespace App\Support;

use Slim\Exception\HttpBadRequestException;
use Slim\Exception\HttpException;
use Slim\Exception\HttpForbiddenException;
use Slim\Exception\HttpMethodNotAllowedException;
use Slim\Exception\HttpNotFoundException;
use Slim\Exception\HttpUnauthorizedException;
use Slim\Handlers\ErrorHandler;
use Throwable;

class ApiErrorHandler extends ErrorHandler
{
    protected function respond(): \Psr\Http\Message\ResponseInterface
    {
        $exception = $this->exception;
        $status = 500;
        $code = 'SERVER_ERROR';
        $message = 'An internal error has occurred while processing your request.';
        $fields = [];

        if ($exception instanceof ApiException) {
            $status = $exception->status;
            $code = $exception->errorCode;
            $message = $exception->getMessage();
            $fields = $exception->fields;
        } elseif ($exception instanceof HttpException) {
            $status = $exception->getCode() ?: 500;

            if ($exception instanceof HttpNotFoundException) {
                $code = 'NOT_FOUND';
            } elseif ($exception instanceof HttpMethodNotAllowedException) {
                $code = 'METHOD_NOT_ALLOWED';
            } elseif ($exception instanceof HttpUnauthorizedException) {
                $code = 'UNAUTHENTICATED';
            } elseif ($exception instanceof HttpForbiddenException) {
                $code = 'INSUFFICIENT_PRIVILEGES';
            } elseif ($exception instanceof HttpBadRequestException) {
                $code = 'BAD_REQUEST';
            }

            $message = $exception->getMessage() ?: $message;
        } elseif ($this->displayErrorDetails && $exception instanceof Throwable) {
            $message = $exception->getMessage();
        }

        if (!$exception instanceof ApiException) {
            $this->logger->error($exception->getMessage(), ['exception' => $exception]);
        }

        $response = $this->responseFactory->createResponse($status);

        return Json::error($response, $code, $message, $status, $fields);
    }

    /**
     * Slim's default implementation logs the full exception trace for every
     * handled error — including controller arguments, which can contain an
     * attempted email/password on the login route. Expected client errors are
     * already reported to the caller, so only genuine server failures are
     * logged, and never with the trace payload.
     */
    protected function logError(string $error): void
    {
        if ($this->exception instanceof ApiException || $this->exception instanceof HttpException) {
            return;
        }

        $this->logger->error(
            sprintf('%s: %s', $this->exception::class, $this->exception->getMessage()),
            ['exception' => $this->exception],
        );
    }
}
