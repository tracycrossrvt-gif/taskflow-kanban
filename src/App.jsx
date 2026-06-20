import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";
import Column from "./components/Column";
import { DndContext } from "@dnd-kit/core";



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

    if (!cardTitle?.trim()) return;

    const newCard = {
      id: crypto.randomUUID(),
     title: cardTitle, 
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

    if (!newTitle?.trim()) return;

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
   if (!window.confirm("Delete this card?")) {
  return;
}

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

function handleDragEnd(event) {
  const { active, over } = event;

  if (!over) return;

  const cardId = active.id;
  const targetColumnId = over.id;

  let movedCard = null;

  const columnsWithoutMovedCard = columns.map((column) => {
    const cardToMove = column.cards.find((card) => card.id === cardId);

    if (cardToMove) {
      movedCard = cardToMove;

      return {
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),
      };
    }

    return column;
  });

  if (!movedCard) return;

  const updatedColumns = columnsWithoutMovedCard.map((column) => {
    if (column.id === targetColumnId) {
      return {
        ...column,
        cards: [...column.cards, movedCard],
      };
    }

    return column;
  });

  setColumns(updatedColumns);
}

const totalTasks = columns.reduce(
  (total, column) => total + column.cards.length,
  0
);

  return (
    <main className="app">
      <h1>TaskFlow Kanban</h1>
      <p>Total Tasks: {totalTasks}</p>


      <DndContext onDragEnd={handleDragEnd}>
  <section className="board">
       {columns.map((column) => (
  <Column
    key={column.id}
    column={column}
    addCard={addCard}
    editCard={editCard}
    deleteCard={deleteCard}
  />
))} 
      
      </section>
      </DndContext>
      <footer className="footer">
  <button
    className="footer__reset"
    onClick={resetBoard}
  >
    Reset  Board
  </button>
</footer>
    </main>
  );
}

export default App;