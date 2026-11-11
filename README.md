# Study Planner

Навчальний застосунок для лабораторних робіт з React. Vite + React 19 + TypeScript, SCSS + BEM, ESLint.

- **Лаб. №8** — компоненти, props, `useState`, події, списки, умовний рендеринг.
- **Лаб. №9** — `useReducer`, Context API, `useEffect`, `localStorage`, custom hooks, Toast, Undoable Delete.

## Запуск

Потрібен Node.js 22.22 або новіший.

```bash
npm install
npm run dev      # режим розробки
npm run lint     # ESLint
npm run build    # tsc -b + збірка Vite
```

## Структура (лаб. №9)

```
src/
├── components/            # кожен компонент має поруч власний .scss (BEM)
│   ├── Header
│   ├── TaskForm           # створення і редагування (один компонент, два режими)
│   ├── TaskStats
│   ├── TaskFilters
│   ├── TaskList
│   ├── TaskItem
│   ├── TaskActions        # «Очистити виконані», «Скинути дані»
│   ├── Toast              # презентаційний компонент (автозакриття, дія, прогрес)
│   └── ToastContainer     # показує Undo-toast і звичайні toast-повідомлення
├── context/
│   ├── TaskContext.ts     # createContext + тип API
│   └── TaskProvider.tsx   # useReducer, таймер, localStorage, toast
├── hooks/
│   ├── useTaskContext.ts  # доступ до контексту (помилка поза Provider)
│   ├── useLocalStorage.ts # useState + localStorage (використовується для фільтра)
│   └── useDocumentTitle.ts
├── reducers/
│   └── taskReducer.ts     # чиста функція, типізовані actions
├── utils/                 # безпечна робота зі storage, type guards
├── data/  types/  styles/ # початкові дані, типи, змінні та глобальні стилі
├── constants.ts
├── App.tsx
└── main.tsx
```

## Як це працює

**State.** `tasks` керує тільки `taskReducer`. Він підтримує дії `add`, `toggle`, `update`,
`requestDelete`, `confirmDelete`, `undoDelete`, `clearCompleted`, `reset` і не містить
таймерів, DOM чи `localStorage` (чиста функція).
Фільтр — окремий state у `useLocalStorage`. Відфільтрований список і статистика —
derived data: рахуються під час render, без `useEffect`.

**Context.** `TaskProvider` надає компонентам `tasks`, `filter` та операції
(`addTask`, `updateTask`, `requestDelete`, `undoDelete` тощо). Значення контексту
мемоїзоване (`useMemo` + `useCallback`). Компоненти не знають про reducer і таймери.

**Effects** (всі в `TaskProvider`, крім заголовка):

| Effect | Залежності | Cleanup |
|---|---|---|
| таймер Undoable Delete (5 с → `confirmDelete`) | `pending` | `clearTimeout` |
| синхронізація `tasks` → `localStorage` | `state.tasks` | — |
| `document.title` = «Study Planner — N active tasks» | `title` | — |
| автозакриття Toast | `autoCloseMs` | `clearTimeout` |

**Undoable Delete.** «Видалити» → `requestDelete`: завдання лишається в масиві, але
потрапляє в `pending` (приглушений вигляд, напис «Буде видалено», кнопки неактивні).
З'являється Toast із прогресом 5 с та кнопкою «Скасувати». Undo → `undoDelete`,
таймер скасовується. Минули 5 с → `confirmDelete`, завдання видаляється остаточно.
Одночасно діє одне видалення: нове запускається після негайного підтвердження попереднього.
«Очистити виконані» працює через той самий flow (`clearCompleted`).

**localStorage.** При старті `tasks` читаються зі сховища. Якщо даних немає, JSON
пошкоджений або має неправильну форму, використовується початковий список.
Незавершене видалення після перезавантаження не відновлюється (завдання просто на місці).

## Що показати на захисті

1. Створення / редагування завдання → Toast.
2. «Видалити» → прогрес → «Скасувати».
3. «Видалити» → почекати 5 с → завдання зникло.
4. Перезавантажити сторінку → дані та фільтр на місці.
5. Компоненти, що беруть дані з Context: `TaskList`, `TaskItem`, `TaskStats`, `TaskFilters`.
6. Код: `useReducer` і `useEffect` — у `TaskProvider.tsx`, `useTaskContext` і `useLocalStorage` — у `hooks/`.

## Git

```bash
git checkout -b feature/state-effects
git commit -m "feat(lab-09): add reducer context and persistence"
```
