# Известные проблемы

| ID | Уровень | Раздел | Проблема | Как воспроизвести | Рекомендация |
|---|---|---|---|---|---|
| GH-001 | Critical | Security | Админ-доступ и PIN реализованы в клиентском коде | Открыть `data/adminStore.ts`, `app/admin*.tsx` | Перенести роли и проверку на backend |
| GH-002 | High | Persistence | Заявки, owner/admin session и обучение теряются после перезапуска | Создать заявку и перезагрузить native/процесс | Постоянное серверное хранилище |
| GH-003 | High | Auth | Вход собственника не проверяет владение телефоном | Ввести произвольные имя/номер | OTP/серверная аутентификация |
| GH-004 | High | Booking | Запись на просмотр только меняет UI | Пройти `/viewing` → `/confirmed` | Backend, календарь и подтверждение |
| GH-005 | High | Privacy | Реальные данные нельзя безопасно хранить в текущем клиентском прототипе | Изучить local/in-memory stores | Политики доступа, шифрование, backend |
| GH-006 | Medium | Recommendation | Match ограничивается 78–98%, скрывая слабые совпадения | Сравнить raw score и UI | Калибровать шкалу и объяснения |
| GH-007 | Medium | Recommendation | Поток циклически повторяет объекты до 10 | Выбрать узкие фильтры | Дедупликация/состояние нехватки |
| GH-008 | Medium | Maps | Yandex карта работает только на web | Открыть owner flow на native | Нативная интеграция или явный fallback |
| GH-009 | Medium | Tests | 2 из 10 check-скриптов падают | Запустить `scripts/check-*.js` | Изолировать `window`; синхронизировать marker |
| GH-010 | Medium | Onboarding | Фактический путь района может обходить бюджет | Пройти `/district` | Уточнить продуктовый сценарий |
| GH-011 | Medium | Tooling | Нет lint/test scripts и Expo Doctor | Посмотреть `package.json` | Добавить после согласования |
| GH-012 | Low | Maintainability | Admin phone allowlist продублирован | Сравнить два admin screen | Единый источник конфигурации |

> GH-001–GH-005 остаются открытыми. Architecture design prepared; implementation not started. См. `AUTH_ROLES_ARCHITECTURE.md`, `PERMISSION_MATRIX.md`, `BACKEND_MIGRATION_PLAN.md`.

Итого: Critical — 1, High — 4, Medium — 6, Low — 1. Проблемы не исправлялись.
