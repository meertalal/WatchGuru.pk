<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Account;
use App\Entity\Coupon;
use App\Entity\Product;
use App\Entity\WarrantySerial;
use App\Repository\AccountRepository;
use App\Repository\CouponRepository;
use App\Repository\WarrantyRepository;
use App\Support\Env;
use Doctrine\ORM\EntityManagerInterface;

final class SeederService
{
    private const COUPONS = [
        ['code' => 'WATCHGURU10', 'type' => 'percent', 'value' => 10, 'label' => '10% off your order'],
        ['code' => 'WELCOME50', 'type' => 'fixed', 'value' => 13826, 'label' => 'PKR 13,826 off your order'],
        ['code' => 'NOUVEAU', 'type' => 'percent', 'value' => 15, 'label' => '15% off, new client offer'],
    ];

    public function __construct(
        private readonly ProductService $products,
        private readonly AccountRepository $accounts,
        private readonly CouponRepository $coupons,
        private readonly WarrantyRepository $warranty,
        private readonly EntityManagerInterface $em,
    ) {
    }

    /** @return array<string, int> */
    public function run(bool $fresh = false): array
    {
        $report = [];

        $existing = (int) $this->em->getRepository(Product::class)->count([]);

        if ($fresh || $existing === 0) {
            $catalogue = $this->products->reset();
            $report['products'] = count($catalogue);
        } else {
            $catalogue = $this->products->list();
            $report['products'] = count($catalogue);
        }

        $productIds = array_values(array_map(
            static fn (array $product): string => (string) $product['id'],
            $catalogue,
        ));

        $report['admin'] = $this->seedAdmin();
        $report['coupons'] = $this->seedCoupons();
        $report['warrantySerials'] = $this->seedWarrantySerials($productIds);

        return $report;
    }

    private function seedAdmin(): int
    {
        $email = strtolower((string) Env::get('ADMIN_EMAIL', 'admin@watchguru.pk'));
        $password = (string) Env::get('ADMIN_PASSWORD', 'admin123');

        $account = $this->accounts->findByEmail($email);

        if ($account === null) {
            $account = new Account();
            $account->email = $email;
        }

        $account->firstName = (string) Env::get('ADMIN_FIRST_NAME', 'Store');
        $account->lastName = (string) Env::get('ADMIN_LAST_NAME', 'Manager');
        $account->phone = (string) Env::get('ADMIN_PHONE', '');
        $account->passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $account->role = 'admin';

        $this->accounts->save($account);

        return 1;
    }

    private function seedCoupons(): int
    {
        foreach (self::COUPONS as $row) {
            $coupon = $this->coupons->findByCode($row['code']);

            if ($coupon === null) {
                $coupon = new Coupon();
                $coupon->code = $row['code'];
            }

            $coupon->type = $row['type'];
            $coupon->value = $row['value'];
            $coupon->label = $row['label'];
            $coupon->active = true;

            $this->coupons->save($coupon, false);
        }

        $this->em->flush();

        return count(self::COUPONS);
    }

    /** @param list<string> $productIds */
    private function seedWarrantySerials(array $productIds): int
    {
        $count = 0;

        for ($i = 1; $i <= 12; $i++) {
            $serial = sprintf('WG-2026-%04d', 1000 + $i);

            if ($this->warranty->findBySerial($serial) !== null) {
                continue;
            }

            $record = new WarrantySerial();
            $record->serial = $serial;
            $record->productId = $productIds === [] ? null : $productIds[($i - 1) % count($productIds)];

            $this->warranty->save($record);
            $count++;
        }

        return $count;
    }
}
