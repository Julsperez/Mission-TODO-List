
import React, { useContext } from "react";
import { TodoContext } from "../../TodoContext";
import "./TodoShowInfo.css";

function TodoShowInfo({ task, onClose, onEdit }) {
  const { todos, setTodos, setTask } = useContext(TodoContext);

  if (!task) return null;

  const handleToggleObjective = (objectiveId) => {
    // Encontrar la tarea y actualizar sus objetivos
    const updatedObjectives = task.objectives.map(obj => {
      if (obj.objectiveId === objectiveId) {
        return { ...obj, isCompleted: !obj.isCompleted };
      }
      return obj;
    });

    const updatedTask = { ...task, objectives: updatedObjectives };

    // Actualizar el estado global de todos
    const updatedTodos = todos.map(todo =>
      todo.missionId === task.missionId ? updatedTask : todo
    );

    setTodos(updatedTodos);
    // Actualizar la tarea actual para reflejar cambios inmediatamente en la UI
    setTask(updatedTask);
  };

  const statusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "archived":
        return "status-archived";
      default:
        return "status-inprogress";
    }
  };

  return (
    <div className="taskInfoContainer">
      <div>
        <h2 className={`taskTitle ${task.isCompleted ? "completed" : ""}`}>{task.title}</h2>
        {task.subtitle && <p className={`taskSubtitle ${task.isCompleted ? "completed" : ""}`}>{task.subtitle}</p>}
      </div>

      <div className="taskInfoHeader">
        <div className="taskInfoHeadLeft">
          <span className={`missionLabel ${task.typeofMission === "side" ? "side" : "main"}`}>
            {task.typeofMission}
          </span>
          <span className={`statusBadge ${statusClass(task.status)}`}>
            {
              task.status === 'in-progress' ? "En progreso" :
                task.status === 'completed' ? "Completada" :
                  "Archivada"
            }
          </span>
        </div>
      </div>


      <div className="taskDescription">
        <h3 className="sectionHeading">Descripción</h3>
        <p>{task.description || "Sin descripción."}</p>
      </div>

      <div className="taskObjectives">
        <h3 className="sectionHeading">Objetivos</h3>
        {task.objectives && task.objectives.length > 0 ? (
          <div className="objectivesList">
            {task.objectives.map((obj) => (
              <label key={obj.objectiveId} className={`objectiveRow ${obj.isCompleted ? "objectiveCompleted" : ""}`}>
                <input
                  type="checkbox"
                  checked={!!obj.isCompleted}
                  onChange={() => handleToggleObjective(obj.objectiveId)}
                  className="objectiveCheckbox"
                />
                <span className="objectiveText">{obj.description}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="noObjectives">No hay objetivos añadidos.</p>
        )}
      </div>

      <div className="taskFooter">
        <button className="taskBtn secondary" onClick={() => onEdit && onEdit()}>Editar</button>
        <button className="taskBtn primary" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}

export { TodoShowInfo };