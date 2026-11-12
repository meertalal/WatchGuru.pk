<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\ContactMessage;
use App\Repository\ContactRepository;
use App\Support\ApiException;
use App\Support\Serializer;

final class ContactService
{
    public function __construct(
        private readonly ContactRepository $messages,
        private readonly MailService $mail,
    ) {
    }

    /** @param array<string, mixed> $input @return array{received: bool} */
    public function send(array $input): array
    {
        $fields = ['name', 'email', 'subject', 'message'];
        $values = [];
        $errors = [];

        foreach ($fields as $field) {
            $value = isset($input[$field]) && is_scalar($input[$field]) ? trim((string) $input[$field]) : '';
            $values[$field] = $value;

            if ($value === '') {
                $errors[$field] = 'This field is required.';
            }
        }

        if (!filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Enter a valid email address.';
        }

        if ($errors !== []) {
            throw ApiException::validation('Please check the contact form.', $errors);
        }

        $message = new ContactMessage();
        $message->name = $values['name'];
        $message->email = strtolower($values['email']);
        $message->subject = $values['subject'];
        $message->message = $values['message'];
        $this->messages->save($message);

        $this->mail->contactAcknowledgement($message);
        $this->mail->contactNotification($message);

        return ['received' => true];
    }

    /** @return list<array<string, mixed>> */
    public function list(): array
    {
        return Serializer::contactMessages($this->messages->all());
    }

    public function delete(int $id): void
    {
        $message = $this->messages->findById($id);

        if ($message === null) {
            throw ApiException::notFound('Message not found.');
        }

        $this->messages->remove($message);
    }
}
