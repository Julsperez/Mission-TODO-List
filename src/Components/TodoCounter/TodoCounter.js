import React from "react";
import "./TodoCounter.css";
import { TodoContext } from "../../TodoContext";

// function TodoCounter({completedTodos, totalTodos}) {
function TodoCounter() {
  const { completedTodos, totalTodos } = React.useContext(TodoContext);
  return (
    <>
      {
        totalTodos === 0 ? (
          <>
            <h1 className="todoTitle">¡Bienvenido a tu lista de misiones!</h1>
            <p className="adviceText">Comienza agregando nuevas misiones para mantenerte organizado y enfocado.</p>
          </>
        ) :
        completedTodos === 0 ? (
          <>
            <h1 className="todoTitle">No has completado ninguna tarea</h1>
            <p className="adviceText">¡Vamos! Tienes misiones que cumplir...</p>
          </>
        ) : completedTodos === totalTodos ? (
          <>
            <h1 className="todoTitle">¡Has completado todas tus misiones!</h1>
            <p className="adviceText">¡Bien hecho! Regresa a tu base espacial a descansar</p>
          </>
        ) : (
          <>
            <h1 className="todoTitle">¡Has completado {completedTodos} de {totalTodos} misiones!</h1>
            <p className="adviceText">La constancia y disciplina son clave para lograr tus objetivos.</p>
          </>
        )
      }
      
    </>

  );
}

export { TodoCounter };