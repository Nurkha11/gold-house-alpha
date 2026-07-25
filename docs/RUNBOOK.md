# Runbook

## Требования

- Node.js: проектом не закреплён; использовать совместимую с Expo 52 LTS-версию;
- pnpm и lockfile;
- опционально `EXPO_PUBLIC_YANDEX_MAPS_API_KEY` для web-карты.

## Установка и запуск

```powershell
pnpm install --frozen-lockfile
pnpm start
pnpm android
pnpm ios
pnpm web
pnpm typecheck
```

На Windows-аудите shim `pnpm exec expo` работал нестабильно; прямой эквивалент:

```powershell
$env:EXPO_HOME=(Resolve-Path '.\.expo-home').Path
$env:EXPO_NO_TELEMETRY='1'
node node_modules\expo\bin\cli start
```

Web export:

```powershell
$env:EXPO_HOME=(Resolve-Path '.\.expo-home').Path
$env:EXPO_NO_TELEMETRY='1'
node node_modules\expo\bin\cli export --platform web --output-dir work\audit-web-export
```

## Фактические проверки 25.07.2026

- `pnpm install --frozen-lockfile --offline`: успешно;
- `pnpm typecheck`: успешно;
- web export: успешно, 961 модуль;
- 8 локальных check-скриптов: успешно;
- `check-buyer-memory.js`: ошибка `window is not defined`;
- `check-owner-location-flow.js`: ожидаемый маркер отсутствует в standalone preview;
- lint script: отсутствует;
- test script/runner: отсутствует;
- Expo Doctor: пакет/команда отсутствует, автоматически не устанавливался.

## Типичные проблемы

- EPERM на `%USERPROFILE%\.expo`: направить `EXPO_HOME` в доступный каталог проекта.
- Карта не работает: проверить имя env-переменной, ограничения ключа и web-платформу.
- Данные исчезли: owner/admin/training state хранится в памяти; это текущее ограничение MVP.

