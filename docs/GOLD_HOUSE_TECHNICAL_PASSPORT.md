# Технический паспорт Gold House

## Резюме

Gold House Alpha — Expo/React Native MVP подбора недвижимости с 20 экранами, 69 локальными объектами, локальным обучением на действиях покупателя, кабинетом собственника, клиентской админкой и web-картой Yandex.

## Стек и запуск

TypeScript 5.3, React 18.3, React Native 0.76.9, Expo 52, Expo Router 4. Установка: `pnpm install --frozen-lockfile`; typecheck: `pnpm typecheck`; запуск: `pnpm start`; web: `pnpm web`. Подробности и Windows fallback — [RUNBOOK.md](RUNBOOK.md).

## Архитектура

Экраны находятся в `app/`, UI — `components/`, локальные данные и логика — `data/`. Точка входа — `expo-router/entry`, layout — `app/_layout.tsx`. Backend отсутствует. См. [ARCHITECTURE.md](ARCHITECTURE.md).

## Что работает

- фильтры города/района/комнат/бюджета/этажа;
- оценка квартир и локальные персональные рекомендации;
- детали, похожие квартиры, локальная история;
- девятишаговая заявка собственника;
- локальная модерация и публикация;
- web-карта и адресные подсказки при наличии ключа.

Частично работают: persistence, авторизация, сохранённое, запись на просмотр, медиа, native location и админка. Подробный статус — [ROADMAP_CURRENT.md](ROADMAP_CURRENT.md).

## Ключевые точки

- рекомендации: `data/aiTrainingStore.ts`;
- каталог: `data/properties.ts`;
- объединение опубликованных объектов: `data/propertyStore.ts`;
- buyer memory: `data/buyerProfileStore.ts`;
- owner/admin state: `data/ownerStore.ts`, `data/adminStore.ts`;
- карта: `components/YandexPropertyMap.tsx`;
- адрес/ЖК: `components/OwnerLocationPicker.tsx`, `data/residentialComplexes.ts`.

## Проверки

Typecheck и web export проходят. 8 из 10 автономных проверок проходят; две падают из-за `window` в Node VM и несовпадения Yandex marker. Lint/test scripts и Expo Doctor отсутствуют.

## Главные риски

1. Клиентская admin security.
2. Отсутствие постоянного хранилища.
3. Отсутствие реальной owner authentication.
4. Запись на просмотр не сохраняется на сервере.
5. Реальные персональные данные нельзя безопасно использовать в текущей архитектуре.

Полный список: [KNOWN_ISSUES.md](KNOWN_ISSUES.md).

## Пять приоритетных следующих задач

1. Спроектировать backend, роли и production-аутентификацию.
2. Перенести заявки, профили и события в постоянное хранилище.
3. Реализовать реальную запись на просмотр и журнал действий.
4. Зафиксировать контракт Match Score/Gold Verified и покрыть тестами.

## Проектирование серверной безопасности

Architecture design prepared; implementation not started. Созданы документы по ролям, серверной авторизации, данным, API, workflow, PII, тестированию, backend-вариантам и миграции; ссылки собраны в `docs/README.md`. GH-001–GH-005 остаются открытыми.
5. Согласовать web-only или native стратегию карт.

Ни одна из этих задач в рамках аудита не выполнялась.
