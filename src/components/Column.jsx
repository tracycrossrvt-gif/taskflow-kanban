import Card from "./Card";
import { useDroppable } from "@dnd-kit/core";


function Column({ column, addCard, editCard, deleteCard }) {

const { setNodeRef } = useDroppable({
  id: column.id,
});

    return (
       <div className="column" ref={setNodeRef}>
      <h2>{column.title}</h2>

      {column.cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          columnId={column.id}
          editCard={editCard}
          deleteCard={deleteCard}
        />
      ))}

      <button onClick={() => addCard(column.id)}>+ Add Card</button>
    </div>
  );
}

export default Column;