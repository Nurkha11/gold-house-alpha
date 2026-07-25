# Backend: модель данных

Рекомендуемая база — PostgreSQL. Все основные ID — UUID; время — `timestamptz` в UTC; денежные значения — integer в тиынах/минимальных единицах либо `numeric`.

## Основные сущности

### users

`id`, `phone_e164` (unique, encrypted/searchable strategy), `display_name`, `status`, `phone_verified_at`, `created_at`, `updated_at`, `deleted_at`.

### roles и user_roles

`roles(id, code)`; `user_roles(user_id, role_id, scope, granted_by, granted_at, revoked_at)`.

### auth_challenges и sessions

OTP challenge хранит hash кода, срок, число попыток и consumed timestamp. Session хранит hash refresh token, device metadata, expiry, revocation и token family.

### buyer_preferences

`user_id`, город, районы, диапазон бюджета, комнаты, категории этажей, версия схемы и timestamp.

### buyer_events

Append-only события: `LIKE`, `DISLIKE`, `VIEW_DETAILS`, `LONG_VIEW_DETAILS`, `CALL_OWNER`, `SCHEDULE_VIEWING`, `SAVE`, `FINAL_RECOMMENDATION`. Содержат `user_id`, `property_id`, время, duration и JSON snapshot с версией.

### properties

`id`, `owner_id`, `status`, адресные и технические поля, цена, описание, публичная точность локации, `version`, timestamps. Публичные и приватные координаты следует разделить.

### property_media

`id`, `property_id`, тип, категория, storage key, MIME, размер, порядок, moderation status, checksum. Клиент не задаёт произвольный публичный URL как доверенный источник.

### property_submissions

Черновик/снимок модерации: `id`, `property_id`, `submitted_version`, `submitted_at`, `status`, `reviewer_id`, `decision_reason`, timestamps.

### residential_complexes

Нормализованный справочник ЖК, aliases, координаты, district, status и merge target. Отдельная таблица `residential_complex_suggestions`.

### viewing_requests

`id`, `property_id`, `buyer_id`, `owner_id`, `status`, requested windows, confirmed interval, timezone, contact sharing state, cancellation reason, timestamps, `version`.

### favorites

Unique `(user_id, property_id)`, timestamps.

### notifications

`id`, recipient, channel, template, payload reference, status, attempts, scheduled/sent timestamps, idempotency key. Персональные данные не копируются в payload без необходимости.

### audit_events

Append-only: actor, action, resource type/id, before/after diff с редактированием чувствительных полей, IP/device, correlation ID, timestamp.

## Ограничения

- FK для всех связей;
- unique phone и favorite;
- optimistic locking через `version`;
- CHECK для цен, площадей, этажей и допустимых статусов;
- координаты и телефон недоступны публичной роли напрямую;
- soft delete для пользовательских и бизнес-сущностей, отдельная purge-процедура;
- миграции версионируются и применяются транзакционно.

