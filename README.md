# TaskFlow — Kanban Task Management

**[Live Demo](https://taskflow-kanban-woad.vercel.app/)** · **[Source Code](https://github.com/tracycrossrvt-gif/taskflow-kanban)**

TaskFlow is a React-based Kanban board for organizing work through a clear, interactive workflow. Users can create and update tasks, move them between stages, and return to their board without losing their changes.

## What it does

- **Manage tasks:** Create, edit, and delete task cards.
- **Move work forward:** Drag and drop cards between workflow columns.
- **Keep work visible:** View task counts and board statistics, with messaging for empty states.
- **Preserve progress:** Save board data locally with `localStorage` across browser sessions.
- **Restart the demo:** Reset the board to its demonstration state.

## Technical implementation

Built with **React, JavaScript, CSS, and Vite**, using **dnd-kit** for drag-and-drop interactions. The UI uses React state and effects to manage task updates and persistence, while derived values keep board counts in sync with the underlying tasks.

The board is intentionally client-side: it does **not** currently require an account or a remote database. This makes the experience easy to explore, though data is specific to the user's browser rather than synchronized across devices.

## Tech stack

- **Frontend:** React, JavaScript, CSS
- **Build tooling:** Vite, ESLint
- **Interaction:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **Persistence:** Browser `localStorage`
- **Deployment:** Vercel

## Run locally

```bash
npm install
npm run dev
```

To run project checks:

```bash
npm run lint
npm run build
```

## Future improvements

The following are ideas for later iterations, **not current features**:

- Refine card styling, spacing, and visual hierarchy
- Add priority labels and due dates
- Support multiple boards
- Explore optional authentication and cross-device synchronization
- Continue refining mobile interactions and accessibility

## Developer

**Tracy Cross** — Software Developer

[Portfolio](https://dev-portfolio-woad-seven.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/tracy-cross-dev/) · [GitHub](https://github.com/tracycrossrvt-gif)
