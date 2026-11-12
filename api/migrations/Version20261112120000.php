<?php

declare(strict_types=1);

namespace WatchGuru\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Inventory ledger for the stock module.
 */
final class Version20261112120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the stock movements ledger.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE stock_movements (id INT AUTO_INCREMENT NOT NULL, product_id VARCHAR(40) NOT NULL, product_name VARCHAR(190) NOT NULL, type VARCHAR(20) NOT NULL, quantity INT NOT NULL, balance_after INT NOT NULL, reason VARCHAR(190) NOT NULL, reference VARCHAR(60) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX idx_stock_movements_product (product_id), INDEX idx_stock_movements_created (created_at), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE stock_movements');
    }
}
