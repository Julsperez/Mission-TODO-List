import React, { useEffect, useRef } from "react";
import { TodoContext } from "../../TodoContext";
import { HiCheck } from "react-icons/hi";
import { ListDivider, TodoItem } from "../";
import "./TodoList.css";

function TodoList() {
  const { setTodos, searchedTodos, todos } = React.useContext(TodoContext);
  const [pillIndex, setPillIndex] = React.useState(0);
  const [filterTodos, setFilterTodos] = React.useState(searchedTodos);
  const [dividerText, setDividerText] = React.useState("Todas las misiones");

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

  useEffect(() => {
    handleSelectedPill(pillIndex);
  }, [searchedTodos]);

  const handleSelectedPill = (pillIndex) => {
    if (pillIndex === 0) {
      setFilterTodos(searchedTodos);
      setDividerText("Todas las misiones");
    } else if (pillIndex === 1) {
      const completed = searchedTodos.filter(todo => todo.isCompleted && todo.status !== "archived");
      setFilterTodos(completed);
      setDividerText("Misiones completadas");
    } else if (pillIndex === 2) {
      const archived = searchedTodos.filter(todo => todo.status === "archived");
      setFilterTodos(archived);
      setDividerText("Misiones archivadas");
    }
    setPillIndex(pillIndex);
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
        {
          !!filterTodos.length && (
            <div className="todoListPanelContent">
              {filterTodos.map(todo => (
                <React.Fragment key={todo.missionId}>
                  <TodoItem
                    todo={todo}
                    onItemUpdated={updateTodos}
                  />
                </React.Fragment>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}

export { TodoList };