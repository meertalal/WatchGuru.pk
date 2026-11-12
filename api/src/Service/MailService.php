<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\ContactMessage;
use App\Entity\Order;
use App\Mail\EmailTemplates;
use App\Support\Env;
use PHPMailer\PHPMailer\PHPMailer;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Sends transactional mail through SMTP. Delivery problems are logged and
 * swallowed so a contact message or order is never lost because the mail
 * server is unreachable.
 */
final class MailService
{
    public function __construct(private readonly LoggerInterface $logger)
    {
    }

    public function contactAcknowledgement(ContactMessage $message): void
    {
        $this->send(
            $message->email,
            $message->name,
            'We received your message — WatchGuru.pk',
            static fn (): string => EmailTemplates::contactAcknowledgement($message),
            $this->storeAddress(),
        );
    }

    public function contactNotification(ContactMessage $message): void
    {
        $this->send(
            $this->storeAddress(),
            'WatchGuru.pk Concierge',
            sprintf('New inquiry: %s', $message->subject),
            static fn (): string => EmailTemplates::contactNotification($message),
            $message->email,
            $message->name,
        );
    }

    public function orderPlaced(Order $order): void
    {
        $this->send(
            $order->email,
            $order->customerName,
            sprintf('Order %s received — WatchGuru.pk', $order->orderNumber),
            static fn (): string => EmailTemplates::orderPlaced($order),
            $this->storeAddress(),
        );
    }

    public function newOrderNotification(Order $order): void
    {
        $this->send(
            $this->storeAddress(),
            'WatchGuru.pk Orders',
            sprintf('New order %s — %s', $order->orderNumber, EmailTemplates::money($order->total)),
            static fn (): string => EmailTemplates::newOrderNotification($order),
            $order->email,
            $order->customerName,
        );
    }

    public function orderStatus(Order $order, string $status, ?string $note = null): void
    {
        $this->send(
            $order->email,
            $order->customerName,
            sprintf('%s — order %s', EmailTemplates::statusLabel($status), $order->orderNumber),
            static fn (): string => EmailTemplates::orderStatus($order, $status, $note),
            $this->storeAddress(),
            null,
            [$this->storeAddress()],
        );
    }

    public function unsubscribeConfirmation(string $email): void
    {
        $this->send(
            $email,
            '',
            'You have been unsubscribed — WatchGuru.pk Dispatch',
            static fn (): string => EmailTemplates::unsubscribeConfirmation($email),
            $this->storeAddress(),
        );
    }

    /** @param list<string> $bcc */
    private function send(
        string $to,
        string $toName,
        string $subject,
        string|callable $html,
        ?string $replyTo = null,
        ?string $replyToName = null,
        array $bcc = [],
    ): void {
        if (!Env::bool('MAIL_ENABLED', false)) {
            return;
        }

        $host = Env::get('MAIL_HOST');
        $from = Env::get('MAIL_FROM_ADDRESS');

        if ($host === null || $from === null) {
            $this->logger->warning('Email skipped for ' . $to . ': MAIL_HOST or MAIL_FROM_ADDRESS is not configured.');

            return;
        }

        $mailer = new PHPMailer(true);

        try {
            $html = is_callable($html) ? $html() : $html;
            $mailer->isSMTP();
            $mailer->Host = $host;
            $mailer->Port = Env::int('MAIL_PORT', 465);
            $mailer->Timeout = Env::int('MAIL_TIMEOUT', 12);

            $username = Env::get('MAIL_USERNAME');
            $mailer->SMTPAuth = $username !== null;
            if ($username !== null) {
                $mailer->Username = $username;
                $mailer->Password = (string) Env::get('MAIL_PASSWORD', '');
            }

            $encryption = strtolower((string) Env::get('MAIL_ENCRYPTION', 'ssl'));
            if ($encryption === 'ssl') {
                $mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } elseif ($encryption === 'tls') {
                $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }

            $mailer->CharSet = PHPMailer::CHARSET_UTF8;
            $mailer->isHTML(true);
            $mailer->setFrom($from, (string) Env::get('MAIL_FROM_NAME', 'WatchGuru.pk'));
            $mailer->addAddress($to, $toName !== '' ? $toName : $to);

            if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
                $mailer->addReplyTo($replyTo, $replyToName ?? $replyTo);
            }

            foreach ($bcc as $copy) {
                if (filter_var($copy, FILTER_VALIDATE_EMAIL) && strcasecmp($copy, $to) !== 0) {
                    $mailer->addBCC($copy);
                }
            }

            $mailer->Subject = $subject;
            $mailer->Body = $html;
            $mailer->AltBody = $this->plainText($html);
            $mailer->send();

            $this->logger->info('Email sent to ' . $to . ' (' . $subject . ').');
        } catch (Throwable $exception) {
            $this->logger->error('Email to ' . $to . ' failed: ' . $exception->getMessage());
        } finally {
            $mailer->smtpClose();
        }
    }

    private function plainText(string $html): string
    {
        $text = str_replace(
            ['<br>', '<br/>', '<br />', '</p>', '</li>', '</tr>', '</h1>'],
            ["\n", "\n", "\n", "\n\n", "\n", "\n", "\n\n"],
            $html,
        );

        $text = html_entity_decode(strip_tags($text), ENT_QUOTES, 'UTF-8');

        return trim((string) preg_replace("/[ \t]+/", ' ', $text));
    }

    private function storeAddress(): string
    {
        $address = Env::get('MAIL_STORE_ADDRESS') ?? Env::get('ADMIN_EMAIL', 'concierge@watchguru.pk');

        return (string) $address;
    }
}
