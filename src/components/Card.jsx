import { useDraggable, useDroppable } from "@dnd-kit/core";

function Card({ card, columnId, editCard, deleteCard }) {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({ id: card.id });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: `card-drop-${card.id}` });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <div ref={setDropRef} className={`card-drop ${isOver ? "card-drop--over" : ""}`}>
      <article ref={setDragRef} style={style} className={`card ${isDragging ? "card--dragging" : ""}`}>
        <div className="card__body"><span className="card__marker" /><span className="card__title">{card.title}</span></div>
        <div className="card__actions">
          <button type="button" className="icon-button" onClick={() => editCard(columnId, card)} aria-label={`Edit ${card.title}`} title="Edit task">✎</button>
          <button type="button" className="icon-button icon-button--delete" onClick={() => deleteCard(columnId, card.id)} aria-label={`Delete ${card.title}`} title="Delete task">×</button>
          <button type="button" className="icon-button card__drag-handle" {...listeners} {...attributes} aria-label={`Drag ${card.title}`} title="Drag to move">⠿</button>
        </div>
      </article>
    </div>
  );
}
export default Card;
