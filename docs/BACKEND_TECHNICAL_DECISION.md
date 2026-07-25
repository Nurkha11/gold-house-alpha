# Gold House: техническое решение по backend

Статус: рекомендуемое решение для MVP. Дата: 25 июля 2026 года.

## Краткое решение

Основной вариант — **hosted Supabase**:

- PostgreSQL как основная база;
- Supabase Auth с входом по телефону;
- Twilio Verify как SMS/OTP-провайдер;
- Supabase Edge Functions на TypeScript/Deno для доверенных команд;
- Supabase Storage для фото, видео и закрытых документов;
- PostgreSQL Row-Level Security (RLS) для защиты строк;
- отдельные SQL-права и DTO/функции для защиты чувствительных столбцов;
- таблица `audit_logs` и серверные audit-функции;
- Supabase CLI + Docker для локальной среды;
- SQL-миграции в `supabase/migrations`;
- managed database backups, PITR при переходе к пилоту и отдельная стратегия резервирования Storage.

Это конкретный выбор для первого backend Gold House, а не абстрактная рекомендация.

## Почему Supabase

Gold House уже использует Expo, React Native и TypeScript, а его модель естественно реляционная: пользователи, роли, объявления, статусы, медиа, избранное и заявки на просмотр. PostgreSQL поддерживает транзакции, ограничения и безопасные переходы состояний. Supabase объединяет Postgres, Auth, Storage, серверные функции и локальный CLI, поэтому MVP можно запустить без отдельной команды DevOps.

RLS даёт второй защитный слой: запрос owner к таблице объявлений ограничивается `auth.uid() = owner_id`. Все таблицы в открытой схеме должны иметь RLS и политику default deny. Сложные команды — назначение ролей, модерация, Gold Verified, раскрытие контактов, резервирование времени — выполняются только Edge Functions или закрытыми database functions, а не прямым клиентским CRUD.

Официальные основания:

- [Phone Login](https://supabase.com/docs/guides/auth/phone-login)
- [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Storage access control](https://supabase.com/docs/guides/storage/security/access-control)
- [Private buckets и signed URLs](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Локальная разработка и миграции](https://supabase.com/docs/guides/local-development/overview)
- [Database backups](https://supabase.com/docs/guides/platform/backups)

## Основная схема сервисов

```text
Expo Web / Android / iOS
        │
        ├── Supabase Auth ── Twilio Verify (SMS OTP)
        │
        ├── PostgREST ── PostgreSQL + RLS
        │
        ├── Edge Functions ── доверенные бизнес-команды
        │                      ├── роли и модерация
        │                      ├── viewing reservation
        │                      ├── signed media operations
        │                      └── audit/outbox
        │
        └── Supabase Storage
               ├── public-property-media
               ├── private-owner-media
               └── private-owner-documents
```

### Authentication

**Buyer.** Может начать с anonymous/guest режима для просмотра каталога. Для синхронизации избранного, истории и заявки на просмотр подтверждает телефон через OTP.

**Owner.** Обязательно подтверждает телефон через Supabase Phone Auth. Роль `owner` выдаётся серверной bootstrap-командой после подтверждения телефона; клиент не может назначить её себе.

**Admin.** Создаётся только вручную доверенным `super_admin` или миграцией. Роль хранится в `user_roles`; краткая роль может дублироваться в `raw_app_meta_data` для JWT, но таблица остаётся источником истины. `raw_user_meta_data` для полномочий не используется.

**Отзыв доступа.** Роль получает `revoked_at`; refresh sessions отзываются. Для немедленного запрета Edge Functions дополнительно проверяют активную роль в БД, а не полагаются только на старый JWT.

**Сессии.** Для MVP использовать настройки Supabase Auth с коротким access JWT и ротируемой refresh session. Целевые значения: access 10–15 минут, refresh до 30 дней. На web — защищённая cookie-схема через серверный auth adapter; на mobile — SecureStore/Keychain/Keystore. Конкретная реализация хранения токена проверяется security review до подключения клиента.

**OTP.** Код одноразовый, после успешной проверки повторно не принимается. Настроить expiry, паузу перед повторной отправкой, лимиты отправки/проверки, CAPTCHA на web и лимит по телефону/IP. Twilio credentials находятся только в Supabase secrets.

### Database

| Таблица | Назначение |
|---|---|
| `users` | Прикладной профиль, связанный с `auth.users` |
| `user_roles` | Роли buyer/owner/admin, scope, выдача и отзыв |
| `buyer_profiles` | Настройки и версия профиля покупателя |
| `owner_profiles` | Проверенные данные собственника и статус профиля |
| `properties` | Объявления, приватные/публичные поля и текущий статус |
| `property_media` | Метаданные фото, видео и документов в Storage |
| `viewing_requests` | Заявка покупателя и её жизненный цикл |
| `viewing_schedules` | Доступные и зарезервированные интервалы |
| `recommendation_signals` | Like/dislike/view/save/call и versioned snapshot |
| `favorites` | Уникальная связь buyer–property |
| `moderation_actions` | Решения модератора, причины и переходы статусов |
| `audit_logs` | Append-only журнал чувствительных и административных действий |

Дополнительно нужны `notifications_outbox`, `residential_complexes`, `property_status_history` и `schema_versions`.

### RLS и защита ресурсов

- `anon`: только разрешённые публичные поля опубликованных объектов;
- `authenticated buyer`: собственный профиль, избранное, сигналы и viewing requests;
- `owner`: только собственные объявления/медиа и минимальная информация по связанным просмотрам;
- `admin`: доступ через серверные команды и scoped policies;
- `service_role`: только Edge Functions; ключ никогда не попадает в Expo bundle.

Точные координаты, телефоны и документы не выдаются через публичный `properties` DTO. Для публичного каталога использовать отдельное безопасное view с `security_invoker` или RPC, подчиняющееся RLS.

### Storage

**Фотографии квартир.** Сначала private bucket. После модерации одобренная производная версия копируется/публикуется в public media bucket. Оригинал остаётся закрытым.

**Видео.** Private bucket, resumable upload, ограничения MIME/размера. Публичная выдача — через одобренную копию или короткую signed URL.

**Документы собственника.** Только отдельный private bucket. Доступ owner к собственным файлам и scoped admin через короткие signed URLs; публичных URL нет.

**Временные ссылки.** Создаются Edge Function после проверки роли и ресурса. Время жизни минимально необходимое.

**Удаление.** Сначала транзакционно помечается запись, затем идемпотентная job удаляет объект Storage и фиксирует результат. Повторные попытки безопасны. Database backup хранит metadata, но не восстанавливает удалённые Storage objects, поэтому для файлов нужна отдельная политика versioning/export/replication.

### Server logic

Только сервер выполняет:

- назначение и отзыв ролей;
- проверку admin scope и MFA;
- вывод owner ID из JWT, а не из body;
- создание заявки и idempotency;
- резервирование времени транзакцией;
- переходы статусов объявления;
- присвоение/снятие Gold Verified;
- раскрытие телефона и точного адреса;
- создание signed URLs;
- административные действия и append-only audit;
- отправку notifications/outbox;
- итоговый production Match Score и его версию.

Edge Functions подходят для коротких HTTP-команд и интеграций. Долгие операции обработки видео или тяжёлые очереди при росте следует вынести в отдельный worker; Edge runtime имеет лимиты выполнения.

### Локальная разработка и миграции

В репозитории создаётся:

```text
supabase/
  config.toml
  migrations/
  seed.sql
  functions/
  tests/
```

`supabase start` запускает локальные Postgres, Auth, Storage и функции через Docker. Схема меняется только SQL-миграциями. Проверка: `supabase db reset`, RLS tests и `supabase db push --dry-run`. Seed используется только для local/staging.

### Резервное копирование

- hosted daily database backups согласно выбранному плану;
- PITR перед реальным пилотом;
- регулярный зашифрованный logical `supabase db dump`/`pg_dump` вне основного проекта;
- ежемесячный restore drill в отдельный test project;
- отдельная копия/репликация private Storage и проверка соответствия `property_media`;
- документированные RPO/RTO до production.

Важно: database backup не включает содержимое Storage, только связанные metadata.

## Резервный вариант

**NestJS + PostgreSQL на AWS**:

- NestJS API в ECS Fargate;
- Amazon RDS for PostgreSQL;
- Amazon Cognito или собственный auth orchestration с Twilio Verify;
- Amazon S3 + CloudFront для media;
- SQS + worker для outbox/обработки;
- ElastiCache Redis для rate limits/locks при необходимости;
- AWS Secrets Manager;
- CloudWatch и отдельный append-only audit;
- Prisma или SQL migrations;
- RDS automated backups/PITR и S3 versioning/lifecycle;
- Docker Compose для локального API/Postgres/Redis.

Выбирать этот вариант стоит, если до реализации уже известно, что потребуются сложные долгие jobs, нестандартная модерация, много внешних интеграций, собственный API gateway или строгий контроль инфраструктуры/регионов.

Он лучше в контроле runtime, очередей, наблюдаемости и независимости бизнес-логики от BaaS. Он сложнее из-за IAM, сети, контейнеров, CI/CD, мониторинга, обновлений, backup/restore и incident response. Потребуются backend-разработчик и DevOps/SRE хотя бы частично. Владельцу и AI-агенту поддерживать его ориентировочно в 2–3 раза сложнее по числу конфигураций и поверхностей отказа, хотя точная трудоёмкость зависит от команды.

## Сравнение

| Критерий | Основной: Supabase | Резервный: NestJS + AWS |
|---|---|---|
| Совместимость с Expo | Высокая, JS SDK/REST | Высокая, обычный HTTPS API |
| Web | Полная | Полная |
| Android | Полная | Полная |
| iOS | Полная | Полная |
| OTP по телефону | Supabase Auth + Twilio Verify | Cognito/Twilio, больше настройки |
| Роли buyer/owner/admin | `user_roles` + RLS + functions | Guards/policies + SQL |
| Защита данных | RLS, SQL grants, private DTO | Полный контроль в API/DB/IAM |
| Фото и видео | Supabase Storage | S3 + CloudFront |
| Миграции | Supabase CLI SQL migrations | Prisma/SQL migrations |
| Локальная разработка | Supabase CLI + Docker | Docker Compose, больше сервисов |
| Тестирование | RLS/SQL/functions/API | Unit/integration/E2E, больше setup |
| Масштабирование | Managed, достаточно для MVP | Более гибкое, требует управления |
| Vendor lock-in | Средний; Postgres снижает риск | AWS-сервисы дают средний lock-in |
| Сложность поддержки | Низкая–средняя | Высокая |
| Скорость запуска MVP | Высокая | Средняя–низкая |
| Стоимость прототипа | Низкая–умеренная; SMS отдельно | Умеренная–высокая; несколько managed services |

Точные цены намеренно не указаны: тарифы, SMS-регион и объёмы хранения меняются. Перед созданием production-проекта нужен отдельный cost check.

## Что остаётся в Expo-клиенте

Безопасно оставить:

- визуальные фильтры и форматирование;
- локальное состояние незавершённой формы;
- отображение карточек и skeleton/error UI;
- анимации;
- навигацию;
- предварительную валидацию для удобства;
- временный draft cache до отправки;
- optimistic UI с обязательным откатом при server error.

Клиенту нельзя доверять:

- роль, owner ID, buyer ID и admin scope;
- итоговый статус объявления;
- Gold Verified/Trust Index;
- право видеть телефон/точный адрес;
- цену/поля как проверенные данные;
- резервирование времени;
- итоговый Match Score;
- MIME/размер/безопасность файла;
- успешность оплаты, уведомления или модерации;
- любые значения из URL/body как доказательство владения.

## План внедрения: 8 независимых этапов

### Этап 0. Контрольная точка

- сохранить текущий рабочий state в отдельной ветке/commit;
- typecheck и web-export;
- зафиксировать список демо-потоков;
- сохранить demo mode feature flag.

Результат: воспроизводимая исходная версия и rollback.

### Этап 1. Backend-каркас

- создать отдельные Supabase local, dev и staging проекты;
- `supabase init`, config, secrets templates;
- пустая схема, миграции и seed;
- CI: reset, migrations, RLS tests;
- backup/restore runbook.

Клиент не подключается.

### Этап 2. Users и roles

- `users`, `user_roles`, базовые RLS;
- bootstrap buyer/owner;
- доверенное назначение admin;
- `audit_logs`;
- deny-by-default тесты.

### Этап 3. Owner OTP

- Twilio Verify в Auth;
- request/verify OTP, rate limits, CAPTCHA web;
- mobile secure session;
- logout/revoke;
- owner видит только собственный профиль.

### Этап 4. Properties и Storage

- drafts, version, media metadata;
- private upload policies;
- отправка на модерацию;
- property status RPC/functions;
- migration только тестового каталога.

### Этап 5. Admin moderation

- admin role + MFA;
- очередь модерации;
- approve/reject/request changes/publish;
- Gold Verified только сервером;
- audit и минимальные DTO.

### Этап 6. Buyer data и recommendations

- preferences, signals, favorites;
- backend recommendations shadow mode;
- сравнение результата с текущей локальной логикой;
- постепенный feature flag rollout.

### Этап 7. Viewing requests и запуск пилота

- schedules и viewing workflow;
- транзакционная бронь;
- outbox и уведомления;
- privacy/security tests;
- pilot cohort, мониторинг и rollback;
- после стабильности удалить доверие к локальным stores.

## Минимальная первая задача

**Создать локальный Supabase-каркас без подключения Expo-приложения.**

Границы:

1. `supabase init`;
2. первая миграция только для `users`, `user_roles`, `audit_logs`;
3. RLS включён на всех трёх таблицах;
4. роли нельзя назначить через клиентский JWT или `raw_user_meta_data`;
5. seed создаёт только вымышленные test users;
6. SQL tests подтверждают:
   - buyer читает только себя;
   - owner читает только себя;
   - обычный пользователь не выдаёт себе admin;
   - service command назначает/revokes role;
   - административное назначение создаёт audit row;
7. `supabase db reset` проходит с нуля;
8. Expo-код, существующие stores и UI не изменяются.

Definition of Done:

- локальная схема воспроизводится одной командой;
- миграции и тесты находятся в version control;
- секретов нет;
- есть инструкция запуска;
- текущий demo mode продолжает работать без backend.

Это минимальный безопасный шаг: он проверяет ключевую модель ролей, не затрагивая работающий клиент и не создавая необратимой зависимости.

## Решение владельцу

Выбрать **Supabase** для MVP и начать с локального каркаса ролей. Не подключать реальные телефоны, документы и административные операции, пока не пройдут RLS/security tests. NestJS + AWS оставить как резерв при подтверждённой потребности в сложных workers, инфраструктурном контроле или требованиях, которые Edge Functions и managed Supabase не покрывают.

