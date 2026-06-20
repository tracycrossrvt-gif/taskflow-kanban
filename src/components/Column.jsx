import Card from "./Card";
import { useDroppable } from "@dnd-kit/core";


function Column({ column, addCard, editCard, deleteCard }) {

const { setNodeRef } = useDroppable({
  id: column.id,
});

    return (
       <div className="column" ref={setNodeRef}>
      <h2>
  {column.title} ({column.cards.length})
</h2>

     {column.cards.length === 0 && (
  <p>No cards yet</p>
)} 

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