# Workflow статусов недвижимости

## Статусы

```text
draft
  → submitted
  → reviewing
  → changes_requested → draft
  → approved
  → published
  → unpublished

submitted/reviewing → withdrawn
reviewing → rejected
published → archived
```

## Правила переходов

| Переход | Кто | Условие |
|---|---|---|
| draft → submitted | Owner | Обязательные поля и media policy выполнены |
| submitted → reviewing | Admin | Заявка назначена модератору |
| reviewing → changes_requested | Admin | Указаны структурированные причины |
| changes_requested → draft | System | Создаётся новая редактируемая версия |
| reviewing → approved | Admin | Контент и локация проверены |
| approved → published | Admin/System | Выполнены publish checks |
| published → unpublished | Admin | Обязательная причина и audit |
| submitted/reviewing → withdrawn | Owner | Нет необратимой публикационной операции |
| reviewing → rejected | Admin | Причина обязательна |
| published → archived | Owner/Admin | По политике продукта |

## Версионирование

Редактирование опубликованного объекта создаёт новую draft revision. Текущая публичная версия остаётся доступной до одобрения следующей. Модератор рассматривает зафиксированный snapshot, а не изменяемый черновик.

## Инварианты

- owner не устанавливает moderation/publication status напрямую;
- опубликована только approved revision;
- rejected/withdrawn revision не публикуется;
- каждое решение содержит actor, timestamp и причину;
- повторная команда с тем же idempotency key не создаёт второй переход;
- конфликт version возвращает `409 CONFLICT`.

## Уведомления

События `submitted`, `changes_requested`, `approved`, `rejected`, `published`, `unpublished` порождают outbox event. Отправка уведомления не является частью транзакции перехода и повторяется безопасно.

