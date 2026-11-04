# Study Planner — Лабораторна робота №8

React Fundamentals: компоненти, JSX, props, стан (`useState`), події, списки та умовний рендеринг.

**Стек:** Vite + React 19 + TypeScript, ESLint, SCSS + BEM (без Bootstrap/Tailwind).

## Запуск

Потрібен Node.js 22.22 або новіший.

```bash
npm install
npm run dev      # режим розробки
npm run lint     # ESLint
npm run build    # tsc -b + збірка Vite
```

## Структура

```
src/
├── components/
│   ├── Header.tsx
│   ├── TaskForm.tsx
│   ├── TaskFilters.tsx
│   ├── TaskItem.tsx
│   ├── TaskList.tsx
│   └── TaskStats.tsx
├── data/
│   ├── initialTasks.ts
│   └── labels.ts
├── styles/            # SCSS, по одному BEM-блоку на компонент
├── types/
│   └── task.ts
├── App.tsx            # state: tasks, filter + обробники
└── main.tsx
```

## Що реалізовано

- Тип `Task` (`id`, `title`, `description`, `completed`, `priority`, `category`).
- Список завдань через `map` зі стабільним `key={task.id}`.
- Додавання завдання; назва обов'язкова, помилка показується в формі (без `alert`), після додавання форма очищається.
- Перемикання «виконано / не виконано» та видалення — через immutable-оновлення (`map`, `filter`, spread).
- Фільтри «Всі / Виконані / Не виконані» (активний підсвічується, список фільтрується без зміни вихідного масиву).
- Статистика (всього / виконано / не виконано) обчислюється з масиву, без окремого state.
- Умовний рендеринг: окремі повідомлення для порожнього списку та порожнього результату фільтра; виконане завдання має інший вигляд.
- Додатково: лічильники в кнопках фільтра, кнопка «Очистити виконані».

## Git

Рекомендований workflow:

```bash
git init
git checkout -b feature/react-fundamentals
git add .
git commit -m "feat(lab-08): implement study planner basics"
```
