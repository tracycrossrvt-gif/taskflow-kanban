function Card({ card, columnId, editCard, deleteCard }) {
  return (
    <div
      className="card"
      onClick={() => editCard(columnId, card.id)}
    >
      <span>{card.title}</span>

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