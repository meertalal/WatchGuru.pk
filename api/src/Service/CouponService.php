<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Coupon;
use App\Repository\CouponRepository;
use App\Support\ApiException;
use App\Support\Serializer;

final class CouponService
{
    private const TYPES = ['percent', 'fixed'];

    public function __construct(private readonly CouponRepository $coupons)
    {
    }

    /** @return array<string, mixed> */
    public function findByCode(string $code): array
    {
        $coupon = $this->coupons->findByCode($code);

        if ($coupon === null || !$coupon->active) {
            throw ApiException::notFound('That coupon code is not recognised.');
        }

        return Serializer::coupon($coupon);
    }

    /** @return list<array<string, mixed>> */
    public function list(): array
    {
        return Serializer::coupons($this->coupons->all());
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    public function create(array $input): array
    {
        $coupon = new Coupon();
        $this->apply($coupon, $input, true);
        $this->coupons->save($coupon);

        return Serializer::coupon($coupon);
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    public function update(int $id, array $input): array
    {
        $coupon = $this->coupons->find($id);

        if ($coupon === null) {
            throw ApiException::notFound('Coupon not found.');
        }

        $this->apply($coupon, $input, false);
        $this->coupons->save($coupon);

        return Serializer::coupon($coupon);
    }

    public function delete(int $id): void
    {
        $coupon = $this->coupons->find($id);

        if ($coupon === null) {
            throw ApiException::notFound('Coupon not found.');
        }

        $this->coupons->remove($coupon);
    }

    /** @param array<string, mixed> $input */
    private function apply(Coupon $coupon, array $input, bool $creating): void
    {
        $errors = [];

        $code = isset($input['code']) && is_scalar($input['code'])
            ? strtoupper(trim((string) $input['code']))
            : ($creating ? '' : $coupon->code);

        if ($code === '' || !preg_match('/^[A-Z0-9_-]{3,40}$/', $code)) {
            $errors['code'] = 'Use 3–40 letters, numbers, hyphens or underscores.';
        }

        $existing = $this->coupons->findByCode($code);
        if ($existing !== null && $existing->id !== $coupon->id) {
            $errors['code'] = 'That coupon code already exists.';
        }

        $type = isset($input['type']) && is_scalar($input['type'])
            ? strtolower(trim((string) $input['type']))
            : ($creating ? 'percent' : $coupon->type);

        if (!in_array($type, self::TYPES, true)) {
            $errors['type'] = 'Choose percent or fixed.';
        }

        $value = isset($input['value']) && is_numeric($input['value'])
            ? (int) $input['value']
            : ($creating ? 0 : $coupon->value);

        if ($value < 1) {
            $errors['value'] = 'Discount must be at least 1.';
        }

        if ($type === 'percent' && $value > 100) {
            $errors['value'] = 'A percentage cannot exceed 100.';
        }

        if ($errors !== []) {
            throw ApiException::validation('Please check the coupon details.', $errors);
        }

        $label = isset($input['label']) && is_scalar($input['label'])
            ? trim((string) $input['label'])
            : ($creating ? '' : $coupon->label);

        $coupon->code = $code;
        $coupon->type = $type;
        $coupon->value = $value;
        $coupon->label = $label;
        $coupon->active = array_key_exists('active', $input)
            ? (bool) $input['active']
            : ($creating ? true : $coupon->active);
    }
}
