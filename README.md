# FILM!

## Установка

### PostgreSQL

Поставьте PostgreSQL или поднимите контейнеры: скопируйте `.env.example` в `.env` и выполните `docker compose up`. База `films`, пользователь `postgres`.

Таблицы и данные: `backend/test/prac.init.sql`, потом `prac.films.sql` и `prac.shedules.sql`. Из init не выполняйте `create database prac` и `owner to prac`.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` — `postgres`
* `DATABASE_URL` — `postgres://localhost:5432/films`
* `DATABASE_USERNAME` и `DATABASE_PASSWORD`

PostgreSQL должна быть запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.

## Сайт

[http://filmoteka.ddns.net](http://filmoteka.ddns.net)
