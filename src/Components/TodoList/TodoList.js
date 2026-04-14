import React, { useEffect, useRef } from "react";
import { TodoContext } from "../../TodoContext";
import { HiCheck } from "react-icons/hi";
import { ListDivider, TodoItem } from "../";
import "./TodoList.css";

function TodoList() {
  const { setTodos, searchedTodos, todos } = React.useContext(TodoContext);
  const [pillIndex, setPillIndex] = React.useState(0);

  const headerRef = useRef(null);
  const [isPinned, setIsPinned] = React.useState(false);
  useEffect(() => {
    const cachedRef = headerRef.current;
    if (!cachedRef) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Si el elemento deja de estar al 100% en su posición original
        setIsPinned(entry.intersectionRatio < 1);
      },
      {
        threshold: [1],
        // El margin negativo en el top fuerza la activación 
        // justo cuando toca el borde superior
        rootMargin: '-9px 0px 0px 0px',
      }
    );

    observer.observe(cachedRef);

    return () => observer.disconnect();
  }, []);

  const filterTodos = React.useMemo(() => {
    if (pillIndex === 0) return searchedTodos;
    if (pillIndex === 1) return searchedTodos.filter(t => t.isCompleted && t.status !== "archived");
    return searchedTodos.filter(t => t.status === "archived");
  }, [searchedTodos, pillIndex]);

  const dividerText = pillIndex === 0 ? "Todas las misiones" : pillIndex === 1 ? "Misiones completadas" : "Misiones archivadas";

  const handleSelectedPill = (index) => {
    setPillIndex(index);
  };

  const updateTodos = (updatedTodo) => {
    let newTodos;
    if (updatedTodo.status === "deleted") {
      newTodos = todos.filter(todo => todo.missionId !== updatedTodo.missionId);
    } else {
      newTodos = todos.map(todo =>
        todo.missionId === updatedTodo.missionId ? updatedTodo : todo
      );
    }
    setTodos(newTodos);
  }

  return (
    <div className="todoListContainer">
      <div ref={headerRef} className={`todoListHeader ${isPinned ? 'is-pinned' : ''}`}>
        {
          [0, 1, 2].map(index => (
            <span key={index}
              className={`headerPill ${pillIndex === index ? "active" : ""}`}
              onClick={() => { handleSelectedPill(index); }}>
              {index === 0 ? "Todas" : index === 1 ? "Completadas" : "Archivadas"}
              {pillIndex === index && (<HiCheck className="check-icon" />)}
            </span>
          ))
        }
      </div>
      <div className="todoListPanel">
        <ListDivider dividerText={dividerText} />
        {filterTodos.length === 0 ? (
          <p className="emptyState">
            {pillIndex === 0
              ? "No hay misiones. ¡Crea tu primera misión, comandante!"
              : pillIndex === 1
              ? "Aún no has completado ninguna misión. ¡Sigue así!"
              : "No hay misiones archivadas."}
          </p>
        ) : (
          <div className="todoListPanelContent">
            {filterTodos.map(todo => (
              <TodoItem
                key={todo.missionId}
                todo={todo}
                onItemUpdated={updateTodos}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export { TodoList };