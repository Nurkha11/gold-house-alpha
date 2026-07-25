# План миграции на backend

Миграция должна быть поэтапной, с feature flags и возможностью отката. Текущий клиент не меняется в рамках этого документа.

## Этап 0. Согласование

- утвердить backend option, роли, retention и публичность адреса;
- зафиксировать OpenAPI и workflow;
- определить среды dev/staging/production и владельцев секретов.

Критерий: подписанные архитектурные решения и threat model.

## Этап 1. Основа

- репозиторий/backend service;
- PostgreSQL migrations;
- secret manager, CI, observability;
- users, roles, sessions, audit;
- OTP provider abstraction.

Откат: backend не подключён к production-клиенту.

## Этап 2. Auth в shadow mode

- клиентский adapter с feature flag;
- server auth без отключения текущего demo flow;
- тестовые аккаунты и role matrix;
- метрики ошибок без записи production-данных.

Откат: выключить flag.

## Этап 3. Owner submissions

- перенести draft/submission/media metadata;
- dual-read на staging, затем backend read;
- импортировать только согласованные тестовые данные;
- включить ownership и property workflow.

Откат: read-only export и возврат к локальному demo dataset; серверные записи не удалять.

## Этап 4. Admin moderation

- server-side admin role/MFA;
- команды переходов статусов;
- audit и notifications outbox;
- удалить доверие к клиентским проверкам только после E2E.

Откат: выключить admin mutations, оставить read-only.

## Этап 5. Buyer memory и recommendations

- preferences/events/favorites на backend;
- versioned score service;
- сравнение локального и серверного результата;
- постепенный rollout по пользователям.

Откат: вернуть локальный score, сохранив server events.

## Этап 6. Viewing requests

- API и workflow;
- календарь/уведомления через jobs;
- защита от двойного бронирования;
- пилот на ограниченной группе.

## Этап 7. Очистка

- удалить client-side полномочия и obsolete stores после периода стабильности;
- оставить offline cache только как недоверенную копию;
- провести privacy review, penetration test и restore drill;
- задокументировать runbook и incident response.

## Общие правила

- никаких big-bang миграций;
- schema/data migrations имеют dry run и backup;
- dual-write допускается только с reconciliation и idempotency;
- feature flag не заменяет backend authorization;
- каждый этап завершается метриками, security tests и планом отката.

