# Варианты backend

## Критерии

Роли и ownership, PostgreSQL-транзакции, media storage, OTP, audit, outbox/jobs, миграции, локальная разработка, стоимость сопровождения и отсутствие привязки бизнес-логики к клиенту.

| Вариант | Плюсы | Ограничения | Пригодность |
|---|---|---|---|
| Supabase: Postgres/Auth/Storage/Edge Functions | Быстрый старт, SQL, RLS, storage, realtime | RLS требует дисциплины; сложные workflow лучше выносить в service layer | Хорошо для MVP |
| Firebase Auth/Firestore/Storage/Functions | Быстрый mobile stack, managed auth | Сложнее транзакционные workflow, связи, отчётность и миграция модели | Средне |
| Собственный TypeScript backend + PostgreSQL | Максимальный контроль ролей, workflow, audit и интеграций | Больше DevOps и времени | Лучший долгосрочный контроль |
| Managed framework/BaaS с PostgreSQL | Быстрый CRUD и SQL | Необходимо проверить зрелость auth, audit и vendor lock-in | Требует оценки |

## Рекомендация

Для короткого MVP: Supabase/PostgreSQL с server-side functions/service layer, если команда готова тщательно тестировать RLS. Для продукта с сильной модерацией и интеграциями: TypeScript backend (например, NestJS/Fastify) + managed PostgreSQL + object storage.

Не рекомендуется помещать весь workflow только в клиент или строить права исключительно на скрытии экранов.

## Решение, которое нужно принять

Владелец должен выбрать приоритет:

- скорость пилота и меньший DevOps;
- полный контроль и постепенное развитие сложных workflow.

До выбора следует сохранить API и модель данных независимыми от конкретного провайдера.

