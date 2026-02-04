import React, { useEffect } from "react";
import { HiCheck } from "react-icons/hi";
import { TodoItem } from "../TodoItem/TodoItem";
import { ListDivider } from "./ListDivider";
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

function TodoList({ setTodos, searchedTodos }) {
  // remove missions from main and side if they are completed
  // const mainMissions = todos.filter(todo => todo.typeofMission === "main");
  // const sideMissions = todos.filter(todo => todo.typeofMission === "side");
  // const completedMissions = todos.filter(todo => todo.isCompleted);

  const [pillIndex, setPillIndex] = React.useState(0);
  const [filterTodos, setFilterTodos] = React.useState(searchedTodos);
  const [dividerText, setDividerText] = React.useState("Todas las misiones");

  // console.log("Searched Todos:", searchedTodos);
  
  useEffect(() => {
    console.log("Filtered Todos:", filterTodos);
    handleSelectedPill(pillIndex);
    // setFilterTodos(searchedTodos);
    
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
    newTodos[todoIndex] = updatedTodo;
    setTodos(newTodos);
  }

  return (
    <div className="todoListContainer">
      <div className="todoListHeader">
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