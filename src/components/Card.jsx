import { useDraggable } from "@dnd-kit/core";

function Card({ card, columnId, editCard, deleteCard }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} className="card">
      <span className="card__title">{card.title}</span>

      <div className="card__actions">
        <button
          type="button"
          onClick={() => editCard(columnId, card.id)}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => deleteCard(columnId, card.id)}
        >
          ✕
        </button>

        <button
          type="button"
          className="card__drag-handle"
          {...listeners}
          {...attributes}
        >
          ⠿
        </button>
      </div>
    </div>
  );
}

export default Card;