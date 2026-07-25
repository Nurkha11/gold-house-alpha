# API-контракты

Префикс: `/api/v1`. Формат — JSON, UTF-8. Все мутации принимают `Idempotency-Key`; ответы содержат `request_id`. Приватные endpoints требуют access token.

## Auth

```text
POST /auth/otp/request       { phone }
POST /auth/otp/verify        { challenge_id, code }
POST /auth/token/refresh
POST /auth/logout
POST /auth/logout-all
GET  /me
```

OTP request всегда возвращает нейтральный ответ, не раскрывающий существование аккаунта.

## Buyer

```text
GET/PUT /me/preferences
GET     /properties?city=&district=&rooms=&budget_min=&budget_max=&floor=
GET     /properties/{id}
POST    /properties/{id}/events      { type, duration_ms? }
GET/POST/DELETE /me/favorites...
GET     /me/recommendations
```

Рекомендация возвращает `score`, `score_version`, `reasons[]`; клиент не вычисляет окончательный production score.

## Owner

```text
GET  /owner/properties
POST /owner/properties
GET/PATCH /owner/properties/{id}
POST /owner/properties/{id}/submit
POST /owner/properties/{id}/withdraw
POST /owner/properties/{id}/media/presign
```

PATCH использует allowlist полей и `If-Match`/version. Owner ID берётся из токена.

## Admin

```text
GET  /admin/submissions
GET  /admin/submissions/{id}
POST /admin/submissions/{id}/start-review
POST /admin/submissions/{id}/request-changes
POST /admin/submissions/{id}/approve
POST /admin/submissions/{id}/reject
POST /admin/properties/{id}/publish
POST /admin/properties/{id}/unpublish
```

Каждая команда требует разрешение, допустимый текущий статус и `reason` там, где решение отрицательное или принудительное.

## Viewing requests

```text
POST /viewing-requests
GET  /me/viewing-requests
GET  /owner/viewing-requests
POST /viewing-requests/{id}/confirm
POST /viewing-requests/{id}/propose-time
POST /viewing-requests/{id}/cancel
POST /viewing-requests/{id}/complete
```

## Ошибки

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Невозможно выполнить операцию",
    "fields": {},
    "request_id": "..."
  }
}
```

Коды: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `VALIDATION_ERROR`, `INVALID_STATE`, `INTERNAL_ERROR`.

## Совместимость

- additive changes внутри v1;
- удаление/изменение семантики — новая версия или объявленная deprecation;
- OpenAPI является машинно-проверяемым контрактом;
- клиентские DTO генерируются либо проверяются contract tests;
- секреты, OTP, refresh token и точные координаты не логируются.

