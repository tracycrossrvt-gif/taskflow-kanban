import { useEffect, useState } from "react";
import "./App.css";



function App() {
  const STORAGE_KEY = "taskflow-columns";

  const [columns, setColumns] = useState(() => {
  const savedColumns = localStorage.getItem(STORAGE_KEY);

  if (savedColumns) {
    return JSON.parse(savedColumns);
  }

  return [
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
  ];
});

useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
}, [columns]);

  function addCard(columnId) {
    const cardTitle = prompt("Enter card title:");

if (!cardTitle) return;
    const newCard = {
      id: crypto.randomUUID(),
     title: prompt("Enter card title:"), 
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

  function deleteCard(columnId, cardId) {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: column.cards.filter((card) => card.id !== cardId),
        };
      }


      return column;
    });

    setColumns(updatedColumns);
  }

function resetBoard() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}  

  return (
    <main className="app">
      <h1>TaskFlow Kanban</h1>

      <button onClick={() => console.log(columns)}>Log Columns</button>

      <button onClick={resetBoard}>
  Reset Board
</button>

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
                <span>{card.title}</span>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteCard(column.id, card.id);
                  }}
                >
                  ✕
                </button>
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