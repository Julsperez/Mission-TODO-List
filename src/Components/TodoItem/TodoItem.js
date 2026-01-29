import "./TodoItem.css";
function TodoItem({ todo }) {
  const showInfo = () => {
    console.log("Misión:", todo);
  };

  const toggleMenu = (event) => {
    event.stopPropagation();
    console.log("Mostrar menú de opciones para la misión:", todo.missionId);
  }

  return (
    // Agregar doble elipsis de drag and drop
    <div className="missionCard" onClick={showInfo}>
      <div className="missionCard-header">
        <span className={`
          missionLabel 
          ${todo.typeofMission === "main" ? "main" : "side"}`
        }>{todo.typeofMission}</span>
      </div>
      <h3 className="missionCard-title">{todo.title}</h3>
      <p className="missionCard-subtitle">{todo.subtitle}</p>
      <button className="missionCard-options" onClick={toggleMenu}></button>
    </div>
  );
}

export { TodoItem };