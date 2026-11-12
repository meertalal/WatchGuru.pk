<?php

declare(strict_types=1);

namespace App\Service;

use App\Repository\NewsletterRepository;
use App\Support\ApiException;
use App\Support\Serializer;

final class NewsletterService
{
    public function __construct(
        private readonly NewsletterRepository $subscribers,
        private readonly MailService $mail,
    ) {
    }

    /** @return array{email: string, unsubscribed: bool} */
    public function unsubscribe(string $email): array
    {
        $email = strtolower(trim($email));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw ApiException::validation('Enter a valid email address.', [
                'email' => 'Enter a valid email address.',
            ]);
        }

        $subscriber = $this->subscribers->findByEmail($email);

        if ($subscriber !== null) {
            $this->subscribers->remove($subscriber);
            $this->mail->unsubscribeConfirmation($email);
        }

        return ['email' => $email, 'unsubscribed' => true];
    }

    /** @return list<array<string, mixed>> */
    public function list(): array
    {
        return Serializer::newsletterSubscribers($this->subscribers->all());
    }

    public function delete(int $id): void
    {
        $subscriber = $this->subscribers->findById($id);

        if ($subscriber === null) {
            throw ApiException::notFound('Subscriber not found.');
        }

        $this->subscribers->remove($subscriber);
    }
}
