# starkstats

Собирает статистику по StarkNet со starkscan.co и представляет ее в виде графиков, также есть опция проверить свои адреса.

## Задеплоенный сервис

По адресу https://starkstats.xyz есть рабочая версия.

Проверка своих адресов: https://starkstats.xyz/batchcheck

## Структура

### client

Клиент сделан на React + TypeScript, типизация сделана не везде. Для роутинга используется react-router-dom.

### server

Сервер сделан на Express + TypeScript, сервер сохраняет данные в MongoDB, также хранит данные в кеше для быстрого доступа и отдает через api.

### parser

Парсер сделан на TypeScript. Аггрегирует данные с GraphQL dipdup https://github.com/dipdup-io/starknet-indexer в mongodb.

### docker-compose

Деплой происходит через docker-compose, используются контейнеры для сервера и базы данных. Также потом можно через nginx проксировать сервер в Сеть и использовать SSL сертефикаты.
