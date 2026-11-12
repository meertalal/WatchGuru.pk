# WatchGuru.pk API

Laravel-style layered backend for the WatchGuru.pk storefront: **Slim 4**, **PHP-DI**,
**Doctrine ORM 3**, **Doctrine Migrations**, and **MySQL**. No customer accounts — the
storefront is guest-only and a single admin account manages the catalogue and orders.

## Requirements

- PHP 8.2+ with `pdo_mysql`, `json`, `zip`, `openssl`, `fileinfo`
- Composer 2
- MySQL 8

## Setup

```bash
cd api
cp .env.example .env          # then edit the database + admin credentials
composer install
composer console migrations:migrate
composer console app:seed --fresh
composer start                # http://127.0.0.1:8090
```

The seed command imports the 23-product catalogue from `config/seeds/products.json`,
creates the admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`, the demo coupons, and
twelve sample warranty serials. Pass `--fresh` to replace the catalogue.

## Layout

```
bootstrap/        Application bootstrap (container, Slim app)
bin/console       Symfony Console entrypoint
config/           dependencies, middleware, routes, seed data
migrations/       Doctrine migrations (WatchGuru\Migrations)
public/           Web root (index.php + .htaccess)
src/
  Command/        Console commands (app:seed)
  Controller/     HTTP controllers (Admin/ for protected endpoints)
  Entity/         Doctrine entities
  Middleware/     CORS + admin token authentication
  Repository/     Doctrine repositories
  Service/        Business rules (validation, totals, stock, auth)
  Support/        Env, Doctrine, Json, Token, Serializer, error handling
```

## Authentication

Admin endpoints accept either header:

```
Authorization: Bearer <token>
X-Admin-Token: <token>
```

Tokens are opaque, stored SHA-256 hashed in `admin_tokens`, and expire after
`ADMIN_TOKEN_TTL_DAYS` (default 7). `POST /api/auth/logout` revokes the current token.

## Response envelope

Success:

```json
{ "data": { "id": "tc-001" } }
```

Error:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Please check the product details.", "fields": { "price": "Price must be a positive number." } } }
```

## Routes

### Public

| Method | Path | Description |
| --- | --- | --- |
| GET | `/` | Service metadata |
| GET | `/api/health` | Health + database check |
| GET | `/api/products?search=` | Catalogue list |
| GET | `/api/products/{slug}` | Product detail |
| GET | `/api/coupons/{code}` | Validate a coupon |
| POST | `/api/orders` | Place a guest order |
| GET | `/api/orders/track?orderNumber=&email=` | Track an order |
| POST | `/api/newsletter/unsubscribe` | Remove an email from the newsletter list |
| POST | `/api/contact` | Send a contact message |
| GET | `/api/warranty/{serial}` | Verify a warranty serial |

### Admin

| Method | Path | Description |
| --- | --- | --- |
| POST | `/api/auth/login` | Issue an admin token |
| GET | `/api/auth/me` | Current admin |
| POST | `/api/auth/logout` | Revoke the current token |
| GET | `/api/admin/orders` | All orders |
| POST | `/api/admin/orders` | Create an order manually |
| GET | `/api/admin/orders/{orderNumber}` | One order |
| PATCH | `/api/admin/orders/{orderNumber}/status` | Advance an order status |
| POST | `/api/admin/products` | Create a product |
| PUT | `/api/admin/products/{id}` | Update a product |
| DELETE | `/api/admin/products/{id}` | Delete a product |
| POST | `/api/admin/catalogue/reset` | Restore the seeded catalogue |
| GET | `/api/admin/stock` | Stock summary + movement ledger |
| GET | `/api/admin/stock/movements` | Movement ledger (optional `productId`) |
| POST | `/api/admin/stock/adjust` | Stock in / out / correction |
| GET | `/api/admin/coupons` | List coupons |
| POST | `/api/admin/coupons` | Create a coupon |
| PUT | `/api/admin/coupons/{id}` | Update a coupon |
| DELETE | `/api/admin/coupons/{id}` | Delete a coupon |
| GET | `/api/admin/customers` | Guest customers aggregated from orders |
| GET | `/api/admin/warranty` | Registered warranty serials |
| POST | `/api/admin/warranty` | Register a serial |
| DELETE | `/api/admin/warranty/{id}` | Delete a serial |
| GET | `/api/admin/contact` | Contact messages |
| DELETE | `/api/admin/contact/{id}` | Delete a message |
| GET | `/api/admin/newsletter` | Newsletter subscribers |
| DELETE | `/api/admin/newsletter/{id}` | Remove a subscriber |

Order statuses: `processing → confirmed → shipped → out-for-delivery → delivered`, with
`cancelled` reachable from any non-final state.

## Order totals

- Subtotal = sum of current product prices × quantities
- Discount = coupon percent or fixed amount (capped at subtotal)
- Tax = 8% of the discounted subtotal
- Shipping = complimentary (PKR 0)
- Stock is decremented atomically when an order is placed

## Testing

```bash
composer test                       # PHPUnit unit tests
powershell -File var/smoke.ps1      # end-to-end smoke test (server must be running)
```
