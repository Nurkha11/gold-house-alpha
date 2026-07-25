# Технологический стек

Источник версий — `package.json` и lockfile.

| Область | Технология |
|---|---|
| Язык | TypeScript 5.3.3, strict mode |
| UI | React 18.3.1, React Native 0.76.9 |
| Платформа | Expo 52.0.x |
| Навигация | Expo Router 4.0.x, файловые маршруты |
| Web | React DOM 18.3.1, React Native Web 0.19.13, Metro |
| Жесты/экраны | gesture-handler 2.20.x, screens 4.4.x |
| Анимации | reanimated 3.16.x |
| UI-дополнения | Expo Vector Icons, Linear Gradient, Status Bar |
| Состояние | module-level variables; browser `localStorage` для памяти покупателя |
| Данные | локальные TypeScript-массивы |
| Карты | Yandex Maps JavaScript API 2.1, только web |

Backend, Firebase, Supabase, ORM, HTTP-клиент, библиотека форм и отдельный state manager отсутствуют.

## Переменные окружения

- `EXPO_PUBLIC_YANDEX_MAPS_API_KEY` — публичный клиентский ключ Yandex Maps. Значение не должно попадать в документацию.

`.env.example` содержит только имя переменной без значения.

## Версии среды

- `.nvmrc` отсутствует.
- На машине аудита: Node.js 24.18.0, pnpm 11.9.0.
- Точная поддерживаемая версия Node.js проектом не зафиксирована; предположительно следует использовать актуальную LTS, совместимую с Expo 52. Требует проверки владельцем.

