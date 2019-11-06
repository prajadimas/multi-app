FROM php:7.2-apache

RUN apt-get update && apt-get install -y zlib1g-dev

COPY server.crt /etc/apache2/ssl/server.crt
COPY server.key /etc/apache2/ssl/server.key
COPY . /var/www/html
COPY vhost.conf /etc/apache2/sites-available/000-default.conf

RUN docker-php-ext-install mysqli pdo pdo_mysql zip mbstring

RUN chown -R www-data:www-data /var/www/html && a2enmod rewrite && a2enmod ssl

RUN service apache2 restart

EXPOSE 443
