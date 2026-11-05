import { useEffect, useRef, useState } from "react";
import { DndContext, PointerSensor, TouchSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import Column from "./components/Column";
import "./App.css";

const STORAGE_KEY = "taskflow-columns";
const STARTER_COLUMNS = [
  { id: "todo", title: "To Do", cards: [{ id: "card-1", title: "Set up project" }, { id: "card-2", title: "Create board layout" }] },
  { id: "in-progress", title: "In Progress", cards: [{ id: "card-3", title: "Learn state structure" }] },
  { id: "done", title: "Done", cards: [{ id: "card-4", title: "Install Vite" }] },
];

function initialColumns() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((column) => Array.isArray(column.cards))) return parsed;
    }
  } catch (error) {
    console.warn("Could not restore saved board:", error);
  }
  return STARTER_COLUMNS.map((column) => ({ ...column, cards: column.cards.map((card) => ({ ...card })) }));
}

function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [dialog, setDialog] = useState(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [notice, setNotice] = useState("");
  const inputRef = useRef(null);
  const dialogRef = useRef(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } })
  );

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(columns)); }
    catch (error) { console.warn("Could not save board:", error); }
  }, [columns]);

  useEffect(() => {
    if (!dialog) return;
    const previousFocus = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setDialog(null);
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const frame = requestAnimationFrame(() => (inputRef.current || dialogRef.current?.querySelector("button"))?.focus());
    return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", onKeyDown); previousFocus?.focus?.(); };
  }, [dialog]);

  function openEditor(columnId, card = null) {
    setDraftTitle(card?.title ?? "");
    setDialog({ type: card ? "edit" : "add", columnId, cardId: card?.id });
  }

  function saveCard(event) {
    event.preventDefault();
    const title = draftTitle.trim();
    if (!title || !dialog) return;
    if (dialog.type === "add") {
      const card = { id: crypto.randomUUID(), title };
      setColumns((current) => current.map((column) => column.id === dialog.columnId ? { ...column, cards: [...column.cards, card] } : column));
      setNotice("Task added");
    } else if (dialog.type === "edit") {
      setColumns((current) => current.map((column) => column.id === dialog.columnId ? {
        ...column, cards: column.cards.map((card) => card.id === dialog.cardId ? { ...card, title } : card)
      } : column));
      setNotice("Task updated");
    }
    setDialog(null);
  }

  function confirmAction() {
    if (dialog?.type === "delete") {
      setColumns((current) => current.map((column) => column.id === dialog.columnId ? {
        ...column, cards: column.cards.filter((card) => card.id !== dialog.cardId)
      } : column));
      setNotice("Task deleted");
    } else if (dialog?.type === "reset") {
      setColumns(STARTER_COLUMNS.map((column) => ({ ...column, cards: column.cards.map((card) => ({ ...card })) })));
      setNotice("Board reset");
    }
    setDialog(null);
  }

  function handleDragEnd({ active, over }) {
    if (!over) return;
    const cardId = String(active.id);
    const targetId = String(over.id);
    setColumns((current) => {
      const source = current.find((column) => column.cards.some((card) => card.id === cardId));
      const targetCardId = targetId.startsWith("card-drop-") ? targetId.slice(10) : null;
      const target = targetCardId
        ? current.find((column) => column.cards.some((card) => card.id === targetCardId))
        : current.find((column) => column.id === targetId);
      if (!source || !target || cardId === targetCardId) return current;
      const moving = source.cards.find((card) => card.id === cardId);
      if (!moving) return current;
      const updated = current.map((column) => ({ ...column, cards: column.cards.filter((card) => card.id !== cardId) }));
      const destination = updated.find((column) => column.id === target.id);
      const targetIndex = targetCardId ? destination.cards.findIndex((card) => card.id === targetCardId) : -1;
      destination.cards.splice(targetIndex >= 0 ? targetIndex : destination.cards.length, 0, moving);
      return updated;
    });
    setNotice("Board updated");
  }

  const total = columns.reduce((sum, column) => sum + column.cards.length, 0);
  const done = columns.find((column) => column.id === "done")?.cards.length ?? 0;
  const inProgress = columns.find((column) => column.id === "in-progress")?.cards.length ?? 0;

  return (
    <main className="app">
      <div className="app__shell">
        <header className="page-header">
          <div>
            <div className="eyebrow"><span className="eyebrow__dot" /> YOUR WORKSPACE / 01</div>
            <h1>Task<span>Flow</span><span className="title-mark">.</span></h1>
            <p className="page-header__description">A little less chaos. A lot more progress. Move work forward, one card at a time.</p>
          </div>
          <button className="button button--primary" type="button" onClick={() => openEditor("todo")}><span aria-hidden="true">＋</span> New task</button>
        </header>

        <section className="stats" aria-label="Board overview">
          <div className="stat"><span className="stat__label">Total tasks</span><strong>{total}</strong><span className="stat__caption">On your board</span></div>
          <div className="stat"><span className="stat__label">In progress</span><strong>{inProgress}</strong><span className="stat__caption">Getting things done</span></div>
          <div className="stat"><span className="stat__label">Completed</span><strong>{done}</strong><span className="stat__caption">Nice work</span></div>
          <div className="stat stat--progress"><span className="stat__label">Completion</span><strong>{total ? Math.round((done / total) * 100) : 0}%</strong><div className="progress-track"><div style={{ width: `${total ? (done / total) * 100 : 0}%` }} /></div></div>
        </section>

        <div className="section-heading"><div><h2>My board</h2><p>Drag cards between stages or use the edit controls to manage tasks.</p></div><span className="section-heading__count">{columns.length} stages</span></div>
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <section className="board" aria-label="Kanban board">
            {columns.map((column) => <Column key={column.id} column={column} addCard={openEditor} editCard={(columnId, card) => openEditor(columnId, card)} deleteCard={(columnId, cardId) => setDialog({ type: "delete", columnId, cardId })} />)}
          </section>
        </DndContext>
        <footer className="footer"><span>Changes save automatically on this device.</span><button type="button" onClick={() => setDialog({ type: "reset" })}>Reset demo board</button></footer>
        <div className="sr-only" role="status" aria-live="polite">{notice}</div>
      </div>

      {dialog && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
        <div className="modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          {dialog.type === "add" || dialog.type === "edit" ? <form onSubmit={saveCard}>
            <div className="modal__eyebrow">TASK DETAILS</div>
            <h2 id="dialog-title">{dialog.type === "add" ? "Create a task" : "Edit task"}</h2>
            <p>Give this task a clear, useful name.</p>
            <label htmlFor="task-title">Task name</label>
            <input id="task-title" ref={inputRef} value={draftTitle} maxLength={120} onChange={(event) => setDraftTitle(event.target.value)} placeholder="e.g. Review portfolio updates" required />
            <div className="modal__actions"><button type="button" className="button button--secondary" onClick={() => setDialog(null)}>Cancel</button><button type="submit" className="button button--primary" disabled={!draftTitle.trim()}>{dialog.type === "add" ? "Create task" : "Save changes"}</button></div>
          </form> : <div>
            <div className="modal__eyebrow">CONFIRM ACTION</div>
            <h2 id="dialog-title">{dialog.type === "delete" ? "Delete this task?" : "Reset your board?"}</h2>
            <p>{dialog.type === "delete" ? "This task will be removed from your board." : "This replaces your current tasks with the original demo tasks. This can't be undone."}</p>
            <div className="modal__actions"><button type="button" className="button button--secondary" onClick={() => setDialog(null)}>Cancel</button><button type="button" className="button button--danger" onClick={confirmAction}>{dialog.type === "delete" ? "Delete task" : "Reset board"}</button></div>
          </div>}
        </div>
      </div>}
    </main>
  );
}

export default App;
