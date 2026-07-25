# Компоненты

В `components/` найдено 16 файлов и 19 экспортируемых функций.

| Компонент | Назначение |
|---|---|
| `Screen`, `Section`, `PageHeader` | Каркас и секции экранов |
| `PrimaryButton`, `OptionButton` | Основные действия и варианты |
| `QuestionCard`, `OnboardingProgress`, `BudgetSlider` | Onboarding |
| `PropertyCard`, `Badge` | Карточка объекта и метки |
| `OwnerField`, `OwnerStepIndicator`, `OwnerStatusBadge` | Формы/статусы собственника |
| `OwnerMediaUploader` | Макет добавления и удаления медиа |
| `OwnerLocationPicker` | Адрес, подсказки, ЖК, предупреждения |
| `YandexPropertyMap` | Загрузка JS API и интерактивная web-карта |

`PrimaryButton` и несколько экранов содержат повторяющиеся стили, но массовый рефакторинг не выполнялся. Специализированные информационные блоки детальной карточки и админки объявлены внутри экранов; это допустимо для MVP, хотя усложняет повторное использование.

