import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";

function Column({ column, addCard, editCard, deleteCard }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <section className={`column column--${column.id} ${isOver ? "column--over" : ""}`} ref={setNodeRef} aria-label={`${column.title} tasks`}>
      <div className="column__top"><div className="column__heading"><span className="column__status" /><h3>{column.title}</h3><span className="column__count">{column.cards.length}</span></div><button className="column__plus" type="button" onClick={() => addCard(column.id)} aria-label={`Add a task to ${column.title}`}>＋</button></div>
      <div className="column__cards">
        {column.cards.length === 0 && <div className="empty-state">Nothing here yet.<span>Drop a task or add one below.</span></div>}
        {column.cards.map((card) => <Card key={card.id} card={card} columnId={column.id} editCard={editCard} deleteCard={deleteCard} />)}
      </div>
      <button className="column__add" type="button" onClick={() => addCard(column.id)}>＋ Add task</button>
    </section>
  );
}
export default Column;
