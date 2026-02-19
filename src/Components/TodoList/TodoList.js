import React, { useEffect, useRef } from "react";
import { TodoContext } from "../../TodoContext";
import { HiCheck } from "react-icons/hi";
import { ListDivider, TodoItem } from "../";
import "./TodoList.css";

// const FILTER_STRATEGIES = {
//   ALL: {
//     id: 0,
//     label: "Todas las misiones",
//     filterFn: (todo) => (todo.status === "archived" || todo.isCompleted),
//   },
//   COMPLETED: {
//     id: 1,
//     label: "Misiones completadas",
//     filterFn: (todo) => todo.isCompleted && todo.status !== "archived",
//   },
//   ARCHIVED: {
//     id: 2,
//     label: "Misiones archivadas",
//     filterFn: (todo) => todo.status === "archived",
//   },
// };

// function TodoList({ onTodoUpdated, searchedTodos }) {
function TodoList() {
  const { setTodos, searchedTodos } = React.useContext(TodoContext);
  // remove missions from main and side if they are completed
  // const mainMissions = todos.filter(todo => todo.typeofMission === "main");
  // const sideMissions = todos.filter(todo => todo.typeofMission === "side");
  // const completedMissions = todos.filter(todo => todo.isCompleted);

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

    // Limpieza al desmontar el componente
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

  // const activeStrategy = Object.values(FILTER_STRATEGIES).find(s => s.id === pillIndex) || FILTER_STRATEGIES.ALL;
  // useMemo(() =>{
  //   setDividerText(activeStrategy.label);
  //   setFilterTodos(searchedTodos.filter(activeStrategy.filterFn));
  // }, [searchedTodos, activeStrategy]);

  const updateTodos = (updatedTodo) => {
    const newTodos = [...searchedTodos];
    const todoIndex = newTodos.findIndex(todo => todo.missionId === updatedTodo.missionId);
    if (updatedTodo.status === "deleted") {
      newTodos.splice(todoIndex, 1);
    } else {
      newTodos[todoIndex] = updatedTodo;
    }
    setTodos(newTodos);
  }

  return (
    <div className="todoListContainer">
      <div ref={headerRef} className={`todoListHeader ${isPinned ? 'is-pinned': ''}`}>
        {
          [0,1,2].map(index => (
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
        <ListDivider dividerText={dividerText}/>
        {
          !!filterTodos.length && (
            <>
              {filterTodos.map(todo => (
                <React.Fragment key={todo.missionId}>
                  <TodoItem
                    todo={todo}
                    onItemUpdated={updateTodos}
                  />
                </React.Fragment>
              ))}
            </>
          )
        }
      </div>


      {/* <ListDivider dividerText={"Misiones secundarias"}/>
      {
        (!!sideMissions.length ? (
          <>
            {sideMissions.map(todo => (
              <TodoItem key={todo.missionId} todo={todo}/>
            ))}
          </>
        ): null )
      }

      <ListDivider dividerText={"Misiones completadas"}/>
      {
        (!!completedMissions.length ? (
          <>
            {completedMissions.map(todo => (
              <TodoItem key={todo.missionId} todo={todo}/>
            ))}
          </>
        ): null )
      } */}
      
    </div>
  );
}

export { TodoList };