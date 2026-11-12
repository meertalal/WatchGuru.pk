#!/bin/sh
set -e

# mod_php requires mpm_prefork. Some base layers also enable mpm_event/worker,
# and Apache refuses to start when more than one MPM is loaded.
for mpm in mpm_event mpm_worker; do
    rm -f "/etc/apache2/mods-enabled/${mpm}.load" "/etc/apache2/mods-enabled/${mpm}.conf"
done

ln -sf /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load
ln -sf /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf

PORT="${PORT:-80}"
sed -ri "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -ri "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

apache2ctl configtest

exec apache2-foreground
