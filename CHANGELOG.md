# Changelog

## Fixed

- **LenisProvider.tsx** Конфиг вынесен в отдельный файл
- **LayoutItemGrid.type.ts**
  - Добавление InfoType(union-тип) для массива данных
  - Замена union на const object + typeof в PanelBlockType
- **usePanelStorage.ts**
  - Исправление проблемы одной ссылки на объект
  - Изменение типов
  - Изменение currentPanel на currentPanelName и всей логики, связанной с этим
  - Разделение логики layout и info, чтобы исключить лишние ререндеры react-grid-layout при изменении info
- **useDataSimulation.ts**
  - Вынесение логики симуляции данных в отдельный хук
  - Вынесение констант в отдельный файл
  - Удаление самоповторения
  - Вынесение повторяющегося кода в отдельные хелперы
- **Dashboard.tsx**
  - Вынесение логики mergeLayout(для работы с layout) в хелпер
  - Адаптация логики под изменения в **usePanelStorage.ts**
- **Buttons.tsx**
  - Адаптация логики под изменения в **usePanelStorage.ts**
- **StatisticElement.tsx**
  - Адаптация логики под изменения в **usePanelStorage.ts**
  - Декомпозиция компонента
  - Декомпозиция дочерних компонентов
  - Вынесена повторяющаяся логика
