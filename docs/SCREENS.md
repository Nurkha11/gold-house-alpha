# Экраны и маршруты

Найдено 20 экранов (не считая `_layout.tsx`).

| Маршрут | Файл | Назначение и переходы | Статус |
|---|---|---|---|
| `/` | `app/index.tsx` | Старт; покупатель или собственник | Реализовано |
| `/buyer-profile` | `app/buyer-profile.tsx` | Профиль/гость; далее city или cabinet | Реализовано |
| `/city` | `app/city.tsx` | Выбор Алматы | Реализовано, один город |
| `/district` | `app/district.tsx` | Мультивыбор двух районов | Реализовано |
| `/budget` | `app/budget.tsx` | Диапазон бюджета | Реализовано |
| `/rooms` | `app/rooms.tsx` | Комнаты, включая «все» | Реализовано |
| `/floor` | `app/floor.tsx` | Первый/средний/последний этаж | Реализовано |
| `/ai-loading` | `app/ai-loading.tsx` | Резюме фильтров | UI-переход |
| `/swipe` | `app/swipe.tsx` | 10 оценок, детали, смена фильтров | Реализовано |
| `/ai-analysis` | `app/ai-analysis.tsx` | Имитация этапов анализа | UI-имитация |
| `/personal-recommendations` | `app/personal-recommendations.tsx` | Топ-3 рекомендаций | Реализовано локально |
| `/property/[id]` | `app/property/[id].tsx` | Детали, медиа, оценка, похожие | Реализовано/частично |
| `/viewing` | `app/viewing.tsx` | Выбор времени просмотра | Только UI |
| `/confirmed` | `app/confirmed.tsx` | Подтверждение просмотра | Только UI |
| `/buyer-cabinet` | `app/buyer-cabinet.tsx` | История, сохранённое, критерии | Реализовано на локальной памяти |
| `/owner-login` | `app/owner-login.tsx` | Макет входа собственника | Без реальной авторизации |
| `/owner-dashboard` | `app/owner-dashboard.tsx` | Заявки собственника | In-memory |
| `/owner-submission` | `app/owner-submission.tsx` | 9 шагов подачи объявления | Реализовано локально |
| `/admin` | `app/admin.tsx` | Список заявок и статусы | Клиентский прототип |
| `/admin-submission` | `app/admin-submission.tsx` | Детали и модерация заявки | Клиентский прототип |

## Состояния

Основные экраны обрабатывают пустые данные и отсутствие объекта. Отдельные системные loading/error/empty-компоненты не унифицированы. Карта имеет `idle/loading/ready/error/missing-key`; адресный поиск — loading/error/empty. Полноценные offline, retry и server-error состояния отсутствуют, поскольку backend отсутствует.

## Расхождение потока

`district.tsx` переходит непосредственно к `/rooms`, тогда как `/budget` существует отдельно. Важно проверить, всегда ли бюджет включён в фактический onboarding: причина текущей схемы не зафиксирована.

