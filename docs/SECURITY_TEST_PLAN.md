# План тестирования безопасности

## Auth

- OTP нельзя использовать дважды или после expiry.
- Ограничены попытки по телефону, IP и device fingerprint.
- Ответ request OTP не раскрывает наличие аккаунта.
- Refresh token ротируется; повтор старого отзывает token family.
- Logout и logout-all прекращают доступ.
- Подменённый/просроченный/неверно подписанный token отклоняется.

## Authorization

- buyer не открывает owner/admin endpoints;
- owner не читает и не меняет чужую заявку;
- admin без нужного scope не модерирует объект;
- прямой URL не обходит backend;
- body `owner_id`, `buyer_id`, `role`, `status` не повышает полномочия;
- запрещённый приватный ресурс не раскрывает своё существование.

## Workflows

- недопустимые переходы property/viewing status возвращают `INVALID_STATE`;
- повторная мутация с тем же idempotency key не дублируется;
- конкурентные confirm/publish дают один результат;
- version conflict возвращает 409;
- audit event создаётся для каждой административной мутации.

## Privacy

- DTO buyer/owner/admin содержат только разрешённые поля;
- точный адрес и телефоны не попадают в публичный каталог;
- OTP, tokens и credentials отсутствуют в логах;
- logout очищает клиентское чувствительное состояние;
- удаление пользователя выполняет согласованную anonymization/purge.

## API и input

- schema validation, ограничение размеров и типов;
- SQL/NoSQL injection, XSS в описаниях, path traversal в media;
- безопасные MIME, checksum и ограничения upload;
- CORS/CSRF для web cookie flow;
- rate limit и защита от массового перебора ID;
- SSRF исключён для импортируемых URL.

## Платформы

- web: cookie flags, CSRF, local storage, XSS;
- Android: backup policy, screenshots/clipboard по необходимости, Keystore;
- iOS: Keychain accessibility, backup, universal links;
- одинаковая серверная матрица прав для всех клиентов.

## Уровни проверки

1. Unit: policy functions и state transitions.
2. Integration: API + database + transaction/outbox.
3. Contract: OpenAPI и клиентские DTO.
4. E2E: buyer/owner/admin happy path и запреты.
5. DAST/SAST/dependency scan в CI.
6. Ручной penetration test перед production-пилотом.

Критерий допуска: нет Critical/High findings, все deny-by-default тесты проходят, восстановление backup и отзыв сессий проверены.

