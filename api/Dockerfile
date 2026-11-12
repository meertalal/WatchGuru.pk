FROM php:8.2-apache

RUN apt-get update && apt-get install -y 
    unzip 
    git 
    libzip-dev 
    && docker-php-ext-install pdo pdo_mysql zip 
    && a2enmod rewrite 
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80