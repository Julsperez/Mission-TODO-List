# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start        # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm deploy       # Build and deploy to GitHub Pages (julsperez.github.io/Mission-TODO-List)
```

No test suite is configured.

## Architecture

This is a Create React App project — a space-themed todo list called "Mission TODO List".

**State management** is handled entirely via React Context (`src/TodoContext/index.js`). `TodoProvider` wraps the app and exposes all shared state (todos, modal visibility flags, search value, active task, pomodoro flag) through `TodoContext`.

**Data persistence** uses `useLocalStorage` (`src/TodoContext/useLocalStorage.js`), a custom hook that reads/writes todos to `localStorage` under the key `defaultTodosV1`. It simulates async loading with a 2-second `setTimeout`.

**App shell** (`src/App/index.js`) wraps `AppContext` in `TodoProvider`. `AppContext` (`src/App/AppContext.js`) consumes the context and orchestrates modal rendering: a single `<Modal>` conditionally renders one of three views based on state flags — `TodoShowInfo` (read), `PomodoroTimer` (focus), or `TodoForm` (create/edit).

**Todo item shape:** `{ missionId, title, isCompleted, ... }` — `missionId` is used for identity when editing.

**Custom hooks:**
- `useLocalStorage` — persistent state with loading/error states
- `usePomodoro` (`src/Hooks/usePomodoro.js`) — countdown timer with toggle/reset, accepts `initialMinutes`

**Component barrel:** `src/Components/index.js` re-exports all components for clean imports.

Each component lives in its own folder under `src/Components/` with a paired `.css` file.
