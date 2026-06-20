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
      <span
        onClick={() => editCard(columnId, card.id)}
        {...listeners}
        {...attributes}
      >
        {card.title}
      </span>

      <button
        onClick={(event) => {
          event.stopPropagation();
          deleteCard(columnId, card.id);
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default Card;