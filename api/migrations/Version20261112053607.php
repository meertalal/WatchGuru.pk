<?php

declare(strict_types=1);

namespace WatchGuru\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261112053607 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create the WatchGuru.pk catalogue, orders, coupons and admin tables.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE accounts (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(190) NOT NULL, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, phone VARCHAR(40) NOT NULL, password_hash VARCHAR(255) NOT NULL, role VARCHAR(20) NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_CAC89EACE7927C74 (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE admin_tokens (id INT AUTO_INCREMENT NOT NULL, token_hash VARCHAR(64) NOT NULL, expires_at DATETIME NOT NULL, created_at DATETIME NOT NULL, account_id INT NOT NULL, UNIQUE INDEX UNIQ_F7922077B3BC57DA (token_hash), INDEX idx_admin_tokens_account (account_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE contact_messages (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(190) NOT NULL, email VARCHAR(190) NOT NULL, subject VARCHAR(190) NOT NULL, message LONGTEXT NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE coupons (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(40) NOT NULL, type VARCHAR(20) NOT NULL, value INT NOT NULL, label VARCHAR(190) NOT NULL, active TINYINT NOT NULL, UNIQUE INDEX UNIQ_F564111877153098 (code), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE newsletter_subscribers (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_19234963E7927C74 (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE order_lines (id INT AUTO_INCREMENT NOT NULL, product_id VARCHAR(40) NOT NULL, slug VARCHAR(190) NOT NULL, name VARCHAR(190) NOT NULL, brand VARCHAR(120) NOT NULL, price INT NOT NULL, quantity INT NOT NULL, image LONGTEXT NOT NULL, order_id INT NOT NULL, INDEX IDX_CC9FF86B8D9F6D38 (order_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE order_status_history (id INT AUTO_INCREMENT NOT NULL, status VARCHAR(30) NOT NULL, changed_at DATETIME NOT NULL, note LONGTEXT DEFAULT NULL, order_id INT NOT NULL, INDEX IDX_471AD77E8D9F6D38 (order_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE orders (id INT AUTO_INCREMENT NOT NULL, order_number VARCHAR(30) NOT NULL, placed_at DATETIME NOT NULL, email VARCHAR(190) NOT NULL, customer_name VARCHAR(190) NOT NULL, shipping JSON NOT NULL, subtotal INT NOT NULL, shipping_cost INT NOT NULL, discount INT NOT NULL, tax INT NOT NULL, total INT NOT NULL, coupon_code VARCHAR(40) DEFAULT NULL, payment_method VARCHAR(30) NOT NULL, status VARCHAR(30) NOT NULL, UNIQUE INDEX UNIQ_E52FFDEE551F0F81 (order_number), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE products (id VARCHAR(40) NOT NULL, slug VARCHAR(190) NOT NULL, name VARCHAR(190) NOT NULL, brand VARCHAR(120) NOT NULL, price INT NOT NULL, compare_at_price INT DEFAULT NULL, description LONGTEXT NOT NULL, highlights JSON NOT NULL, images JSON NOT NULL, category VARCHAR(20) NOT NULL, collections JSON NOT NULL, dial_color VARCHAR(40) NOT NULL, strap_type VARCHAR(40) NOT NULL, case_material VARCHAR(80) NOT NULL, case_size VARCHAR(40) NOT NULL, movement VARCHAR(80) NOT NULL, features JSON NOT NULL, specs JSON NOT NULL, variants JSON DEFAULT NULL, badge VARCHAR(20) DEFAULT NULL, in_stock TINYINT NOT NULL, stock INT NOT NULL, added_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_B3BA5A5A989D9B62 (slug), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE warranty_serials (id INT AUTO_INCREMENT NOT NULL, serial VARCHAR(60) NOT NULL, product_id VARCHAR(40) DEFAULT NULL, verified_at DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_736DF609D374C9DC (serial), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE admin_tokens ADD CONSTRAINT FK_F79220779B6B5FBA FOREIGN KEY (account_id) REFERENCES accounts (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE order_lines ADD CONSTRAINT FK_CC9FF86B8D9F6D38 FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE order_status_history ADD CONSTRAINT FK_471AD77E8D9F6D38 FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE admin_tokens DROP FOREIGN KEY FK_F79220779B6B5FBA');
        $this->addSql('ALTER TABLE order_lines DROP FOREIGN KEY FK_CC9FF86B8D9F6D38');
        $this->addSql('ALTER TABLE order_status_history DROP FOREIGN KEY FK_471AD77E8D9F6D38');
        $this->addSql('DROP TABLE accounts');
        $this->addSql('DROP TABLE admin_tokens');
        $this->addSql('DROP TABLE contact_messages');
        $this->addSql('DROP TABLE coupons');
        $this->addSql('DROP TABLE newsletter_subscribers');
        $this->addSql('DROP TABLE order_lines');
        $this->addSql('DROP TABLE order_status_history');
        $this->addSql('DROP TABLE orders');
        $this->addSql('DROP TABLE products');
        $this->addSql('DROP TABLE warranty_serials');
    }
}
