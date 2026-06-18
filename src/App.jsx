import { useState } from "react";
import "./App.css";

function App() {
  const [columns, setColumns] = useState([
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: "card-1", title: "Set up project" },
        { id: "card-2", title: "Create board layout" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      cards: [{ id: "card-3", title: "Learn state structure" }],
    },
    {
      id: "done",
      title: "Done",
      cards: [{ id: "card-4", title: "Install Vite" }],
    },
  ]);

  function addCard(columnId) {
    const newCard = {
      id: crypto.randomUUID(),
      title: "New Task",
    };

  

    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: [...column.cards, newCard],
        };
      }

      return column;
    });

    setColumns(updatedColumns);
  }

  function editCard(columnId, cardId) {
  const newTitle = prompt("Edit card title:");

  if (!newTitle) return;

  const updatedColumns = columns.map((column) => {
    if (column.id === columnId) {
      return {
        ...column,
        cards: column.cards.map((card) => {
          if (card.id === cardId) {
            return {
              ...card,
              title: newTitle,
            };
          }

          return card;
        }),
      };
    }

    return column;
  });

  setColumns(updatedColumns);
}

  return (
    <main className="app">
      <h1>TaskFlow Kanban</h1>

      <button onClick={() => console.log(columns)}>Log Columns</button>

      <section className="board">
        {columns.map((column) => (
          <div className="column" key={column.id}>
            <h2>{column.title}</h2>

            {column.cards.map((card) => (
             <div
  className="card"
  key={card.id}
  onClick={() => editCard(column.id, card.id)}
>
  {card.title}
</div> 
            ))}

            <button onClick={() => addCard(column.id)}>+ Add Card</button>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;