<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\WarrantySerial;
use App\Repository\WarrantyRepository;
use App\Support\ApiException;
use App\Support\Serializer;
use DateTimeImmutable;

final class WarrantyService
{
    public function __construct(private readonly WarrantyRepository $serials)
    {
    }

    /** @return array{serial: string, productId: string|null, verified: bool, verifiedAt: string} */
    public function verify(string $serial): array
    {
        $record = $this->serials->findBySerial($serial);

        if ($record === null) {
            throw ApiException::notFound('That serial number is not registered with WatchGuru.pk.');
        }

        $record->verifiedAt = new DateTimeImmutable();
        $this->serials->save($record);

        return [
            'serial' => $record->serial,
            'productId' => $record->productId,
            'verified' => true,
            'verifiedAt' => $record->verifiedAt->format(DATE_ATOM),
        ];
    }

    /** @return list<array<string, mixed>> */
    public function list(): array
    {
        return Serializer::warrantySerials($this->serials->all());
    }

    /** @param array<string, mixed> $input @return array<string, mixed> */
    public function create(array $input): array
    {
        $serial = isset($input['serial']) && is_scalar($input['serial'])
            ? strtoupper(trim((string) $input['serial']))
            : '';

        if ($serial === '') {
            throw ApiException::validation('Enter a serial number.', [
                'serial' => 'Serial number is required.',
            ]);
        }

        if ($this->serials->findBySerial($serial) !== null) {
            throw ApiException::validation('That serial is already registered.', [
                'serial' => 'That serial is already registered.',
            ]);
        }

        $productId = isset($input['productId']) && is_scalar($input['productId'])
            ? trim((string) $input['productId'])
            : '';

        $record = new WarrantySerial();
        $record->serial = $serial;
        $record->productId = $productId !== '' ? $productId : null;
        $this->serials->save($record);

        return Serializer::warrantySerial($record);
    }

    public function delete(int $id): void
    {
        $record = $this->serials->findById($id);

        if ($record === null) {
            throw ApiException::notFound('Warranty serial not found.');
        }

        $this->serials->remove($record);
    }
}
