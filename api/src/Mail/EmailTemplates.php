<?php

declare(strict_types=1);

namespace App\Mail;

use App\Entity\ContactMessage;
use App\Entity\Order;
use App\Support\Env;

/**
 * Branded, table-based HTML emails that render consistently across mail
 * clients. Every visitor-supplied value is escaped before it reaches the
 * markup.
 */
final class EmailTemplates
{
    private const STATUS_LABELS = [
        'processing' => 'Processing',
        'confirmed' => 'Confirmed',
        'shipped' => 'Shipped',
        'out-for-delivery' => 'Out for delivery',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
    ];

    private const PAYMENT_LABELS = [
        'cod' => 'Cash on Delivery',
        'bank-transfer' => 'Bank Transfer',
        'easypaisa' => 'Easypaisa',
        'jazzcash' => 'JazzCash',
    ];

    public static function statusLabel(string $status): string
    {
        return self::STATUS_LABELS[$status] ?? ucfirst(str_replace('-', ' ', $status));
    }

    public static function paymentLabel(string $method): string
    {
        return self::PAYMENT_LABELS[$method] ?? ucfirst(str_replace('-', ' ', $method));
    }

    public static function money(int $amount): string
    {
        return 'Rs. ' . number_format($amount);
    }

    public static function contactAcknowledgement(ContactMessage $message): string
    {
        $body = self::greeting($message->name)
            . self::paragraph('Thank you for writing to WatchGuru.pk. Your message has reached our concierge desk, and we will reply within one business day, usually much sooner.')
            . self::panel([
                'Subject' => $message->subject,
                'Your message' => nl2br(self::e($message->message)),
            ])
            . self::paragraph('Need a faster reply? Message us on WhatsApp at +92 322 2242389, daily 9am to 9pm PKT.')
            . self::button('Visit the boutique', self::siteUrl());

        return self::layout('Message received', 'We have your message', $body, 'Our concierge team will reply within one business day.');
    }

    public static function contactNotification(ContactMessage $message): string
    {
        $rows = [
            'Name' => self::e($message->name),
            'Email' => '<a href="mailto:' . self::e($message->email) . '" style="color:#c8a24a;text-decoration:none;">' . self::e($message->email) . '</a>',
            'Subject' => self::e($message->subject),
            'Received' => self::e($message->createdAt->format('j M Y, g:i a')),
        ];

        $body = self::greeting('WatchGuru.pk team')
            . self::paragraph('A new inquiry arrived through the website contact form.')
            . self::panel($rows)
            . self::panel(['Message' => nl2br(self::e($message->message))])
            . self::button('Reply to ' . $message->name, 'mailto:' . $message->email);

        return self::layout('New inquiry', 'A customer is waiting', $body, 'New inquiry from ' . $message->name . '.');
    }

    public static function orderPlaced(Order $order): string
    {
        $body = self::greeting(self::firstName($order))
            . self::paragraph(sprintf(
                'Thank you for your order. We have received %s and our team will confirm it shortly by phone or WhatsApp.',
                self::e($order->orderNumber),
            ))
            . self::orderSummary($order)
            . self::shippingBlock($order)
            . self::paragraph('Every watch is authenticated, prepared and sealed by hand before dispatch. Insured delivery usually takes 2 to 5 business days, signature included.')
            . self::button('Track your order', self::trackUrl($order));

        return self::layout(
            'Order received',
            'Your watch is with our team',
            $body,
            sprintf('Order %s received. We will confirm it shortly.', $order->orderNumber),
        );
    }

    public static function newOrderNotification(Order $order): string
    {
        $body = self::greeting('WatchGuru.pk team')
            . self::paragraph(sprintf(
                'A new order was placed by %s (%s) for %s.',
                self::e($order->customerName),
                self::e($order->email),
                self::money($order->total),
            ))
            . self::panel([
                'Order' => self::e($order->orderNumber),
                'Payment' => self::e(self::paymentLabel($order->paymentMethod)),
                'Placed' => self::e($order->placedAt->format('j M Y, g:i a')),
            ])
            . self::orderSummary($order)
            . self::shippingBlock($order)
            . self::button('Open in admin', self::siteUrl() . '/admin/orders');

        return self::layout(
            'New order',
            'An order just came in',
            $body,
            sprintf('New order %s — %s', $order->orderNumber, self::money($order->total)),
        );
    }

    public static function orderStatus(Order $order, string $status, ?string $note = null): string
    {
        $copy = self::statusCopy($status, $order);

        $body = self::greeting(self::firstName($order))
            . self::paragraph($copy)
            . self::panel([
                'Order' => self::e($order->orderNumber),
                'Status' => self::e(self::statusLabel($status)),
                'Total' => self::money($order->total),
                'Payment' => self::e(self::paymentLabel($order->paymentMethod)),
            ]);

        if ($note !== null && trim($note) !== '') {
            $body .= self::panel(['Note from our team' => nl2br(self::e(trim($note)))]);
        }

        if ($status === 'cancelled') {
            $body .= self::paragraph('If an advance was paid, our team will contact you shortly to arrange the refund.');
            $body .= self::button('Contact the concierge', self::siteUrl() . '/contact');
        } else {
            $body .= self::button('Track your order', self::trackUrl($order));
        }

        return self::layout(
            'Order update',
            self::statusTitle($status),
            $body,
            sprintf('Order %s is now %s.', $order->orderNumber, strtolower(self::statusLabel($status))),
        );
    }

    public static function unsubscribeConfirmation(string $email): string
    {
        $body = self::greeting('there')
            . self::paragraph(sprintf(
                '%s has been removed from The Dispatch. You will no longer receive our monthly letter.',
                self::e($email),
            ))
            . self::paragraph('If this happened by mistake, reply to this email and we will add you back.')
            . self::button('Visit WatchGuru.pk', self::siteUrl());

        return self::layout('Unsubscribed', 'You are off the list', $body, 'You have been removed from The Dispatch.');
    }

    private static function statusTitle(string $status): string
    {
        return match ($status) {
            'confirmed' => 'Your order is confirmed',
            'shipped' => 'Your order has shipped',
            'out-for-delivery' => 'Out for delivery today',
            'delivered' => 'Your order has been delivered',
            'cancelled' => 'Your order was cancelled',
            'processing' => 'We are preparing your order',
            default => 'Your order has been updated',
        };
    }

    private static function statusCopy(string $status, Order $order): string
    {
        $number = self::e($order->orderNumber);

        return match ($status) {
            'confirmed' => sprintf('Order %s is confirmed. Your watch is now being prepared and sealed by hand.', $number),
            'shipped' => sprintf('Order %s is on its way. Insured delivery usually takes 2 to 5 business days, and a signature is required on arrival.', $number),
            'out-for-delivery' => sprintf('Order %s is with our courier and should reach you today. Please keep your phone nearby.', $number),
            'delivered' => sprintf('Order %s has been delivered. We hope you love it. Your one-year machine warranty is now active.', $number),
            'cancelled' => sprintf('Order %s has been cancelled.', $number),
            'processing' => sprintf('Order %s is being prepared by our team.', $number),
            default => sprintf('There is an update on order %s.', $number),
        };
    }

    private static function orderSummary(Order $order): string
    {
        $rows = '';

        foreach ($order->lines as $line) {
            $rows .= '<tr>'
                . '<td style="padding:10px 0;border-bottom:1px solid #2a2a2e;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:#f4f1ea;">'
                . self::e($line->name)
                . '<br><span style="color:#7f7a70;font-size:11px;">' . self::e($line->brand) . ' · Qty ' . $line->quantity . '</span>'
                . '</td>'
                . '<td align="right" style="padding:10px 0;border-bottom:1px solid #2a2a2e;font-family:Arial,sans-serif;font-size:13px;color:#f4f1ea;white-space:nowrap;">'
                . self::money($line->price * $line->quantity)
                . '</td>'
                . '</tr>';
        }

        $totals = '<tr><td style="padding:8px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#b9b3a7;">Subtotal</td><td align="right" style="padding:8px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#f4f1ea;">' . self::money($order->subtotal) . '</td></tr>';

        if ($order->discount > 0) {
            $totals .= '<tr><td style="padding:6px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#b9b3a7;">Discount' . ($order->couponCode !== null ? ' (' . self::e($order->couponCode) . ')' : '') . '</td><td align="right" style="padding:6px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#c8a24a;">−' . self::money($order->discount) . '</td></tr>';
        }

        $totals .= '<tr><td style="padding:6px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#b9b3a7;">Shipping</td><td align="right" style="padding:6px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#f4f1ea;">' . ($order->shippingCost === 0 ? 'Free, insured' : self::money($order->shippingCost)) . '</td></tr>'
            . '<tr><td style="padding:6px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#b9b3a7;">Tax</td><td align="right" style="padding:6px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#f4f1ea;">' . self::money($order->tax) . '</td></tr>'
            . '<tr><td style="padding:14px 0 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#f4f1ea;">Total</td><td align="right" style="padding:14px 0 0;font-family:Arial,sans-serif;font-size:18px;color:#f4f1ea;">' . self::money($order->total) . '</td></tr>';

        return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0;border-top:1px solid #2a2a2e;">'
            . $rows
            . $totals
            . '</table>';
    }

    private static function shippingBlock(Order $order): string
    {
        $shipping = $order->shipping;
        $lines = [
            trim(((string) ($shipping['firstName'] ?? '')) . ' ' . ((string) ($shipping['lastName'] ?? ''))),
            (string) ($shipping['address'] ?? ''),
            (string) ($shipping['apartment'] ?? ''),
            trim(((string) ($shipping['city'] ?? '')) . ', ' . ((string) ($shipping['state'] ?? '')) . ' ' . ((string) ($shipping['postalCode'] ?? ''))),
            (string) ($shipping['country'] ?? ''),
            (string) ($shipping['phone'] ?? ''),
        ];

        $lines = array_values(array_filter(array_map('trim', $lines), static fn (string $line): bool => $line !== ''));

        $address = implode('<br>', array_map(static fn (string $line): string => self::e($line), $lines));

        return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 18px;background:#101012;border:1px solid #2a2a2e;">'
            . '<tr><td style="padding:16px 18px;">'
            . '<p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#c8a24a;">Shipping to</p>'
            . '<p style="margin:0;font-family:Arial,sans-serif;font-size:12.5px;line-height:1.7;color:#b9b3a7;">' . $address . '</p>'
            . '</td></tr></table>';
    }

    private static function greeting(string $name): string
    {
        return self::paragraph('Hello ' . self::e($name) . ',');
    }

    private static function paragraph(string $html): string
    {
        return '<p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:14px;line-height:1.75;color:#b9b3a7;">' . $html . '</p>';
    }

    /** @param array<string, string> $rows */
    private static function panel(array $rows): string
    {
        $html = '';

        foreach ($rows as $label => $value) {
            $html .= '<tr>'
                . '<td style="padding:7px 0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#7f7a70;vertical-align:top;width:34%;">' . self::e($label) . '</td>'
                . '<td style="padding:7px 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.6;color:#f4f1ea;">' . $value . '</td>'
                . '</tr>';
        }

        return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 18px;background:#101012;border:1px solid #2a2a2e;">'
            . '<tr><td style="padding:12px 18px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $html . '</table></td></tr>'
            . '</table>';
    }

    private static function button(string $label, string $url): string
    {
        return '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0 6px;">'
            . '<tr><td style="background:#c8a24a;">'
            . '<a href="' . self::e($url) . '" style="display:inline-block;padding:13px 24px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#0b0b0c;text-decoration:none;font-weight:bold;">'
            . self::e($label)
            . '</a></td></tr></table>';
    }

    private static function layout(string $eyebrow, string $title, string $body, string $preheader): string
    {
        $year = date('Y');

        return '<!doctype html>'
            . '<html lang="en"><head><meta charset="utf-8">'
            . '<meta name="viewport" content="width=device-width, initial-scale=1">'
            . '<title>' . self::e($title) . '</title></head>'
            . '<body style="margin:0;padding:0;background:#0b0b0c;">'
            . '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' . self::e($preheader) . '</div>'
            . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0b0c;padding:32px 12px;">'
            . '<tr><td align="center">'
            . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#141416;border:1px solid #2a2a2e;">'
            . '<tr><td style="padding:26px 32px;border-bottom:1px solid #2a2a2e;">'
            . '<span style="font-family:Georgia,\'Times New Roman\',serif;font-size:20px;letter-spacing:4px;color:#f4f1ea;">WATCHGURU<span style="color:#c8a24a;">.PK</span></span>'
            . '</td></tr>'
            . '<tr><td style="padding:32px;">'
            . '<p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:#c8a24a;">' . self::e($eyebrow) . '</p>'
            . '<h1 style="margin:0 0 18px;font-family:Georgia,\'Times New Roman\',serif;font-weight:normal;font-size:26px;line-height:1.25;color:#f4f1ea;">' . self::e($title) . '</h1>'
            . $body
            . '</td></tr>'
            . '<tr><td style="padding:22px 32px;border-top:1px solid #2a2a2e;font-family:Arial,sans-serif;font-size:10.5px;line-height:1.8;color:#7f7a70;">'
            . 'WatchGuru.pk Boutique · Phase 6, DHA, Karachi 75500 · +92 322 2242389<br>'
            . '<a href="mailto:concierge@watchguru.pk" style="color:#c8a24a;text-decoration:none;">concierge@watchguru.pk</a>'
            . '<br><br>© ' . $year . ' WatchGuru.pk Boutique. All rights reserved.'
            . '</td></tr>'
            . '</table>'
            . '</td></tr></table>'
            . '</body></html>';
    }

    private static function firstName(Order $order): string
    {
        $first = trim((string) ($order->shipping['firstName'] ?? ''));

        return $first !== '' ? $first : $order->customerName;
    }

    private static function trackUrl(Order $order): string
    {
        return self::siteUrl()
            . '/track-order?number=' . rawurlencode($order->orderNumber)
            . '&email=' . rawurlencode($order->email);
    }

    private static function siteUrl(): string
    {
        return rtrim((string) Env::get('SITE_URL', 'https://warchgurupk.vercel.app'), '/');
    }

    private static function e(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    }
}
