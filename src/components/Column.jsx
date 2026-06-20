import Card from "./Card";

function Column({ column, addCard, editCard, deleteCard }) {
  return (
    <div className="column">
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