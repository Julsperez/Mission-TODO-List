import "./TodoCounter.css";

function TodoCounter({completedTodos, totalTodos}) {
  return (
    <>
      {
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