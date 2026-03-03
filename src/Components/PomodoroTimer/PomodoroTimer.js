import React, { useContext } from 'react';
import { usePomodoro } from '../../Hooks/usePomodoro';
import { TodoContext } from '../../TodoContext';
import { HiOutlinePlay, HiOutlinePause, HiOutlineRefresh } from 'react-icons/hi';
import './PomodoroTimer.css';

function PomodoroTimer({ task }) {
  const { isActive, toggleTimer, resetTimer, formatTime } = usePomodoro();
  const { todos, setTodos, setTask } = useContext(TodoContext);

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

  return (
    <div className="pomodoro-container">
      <h2 className="pomodoro-title">{task.title}</h2>
      <p className="pomodoro-description">
        <span>{!!task.subtitle ? `${task.subtitle}` : ""}</span>
        <span>{!!task.description ? `${task.description}` : ""}</span>
      </p>
      <div className="pomodoro-timer">
        {formatTime()}
      </div>
      <div className="pomodoro-controls">
        <button
          className={`pomodoro-btn ${isActive ? 'pause' : 'play'}`}
          onClick={toggleTimer}
          aria-label={isActive ? 'Pausar' : 'Iniciar'}
        >
          {isActive ? <HiOutlinePause /> : <HiOutlinePlay />}
        </button>
        <button
          className="pomodoro-btn reset"
          onClick={resetTimer}
          aria-label="Reiniciar"
        >
          <HiOutlineRefresh />
        </button>
      </div>

      <p className="pomodoro-status">
        {isActive ? 'Enfocado en la tarea...' : 'Listo para iniciar tarea'}
      </p>
      <div className='pomodoro-objectives'>
        {task.objectives && task.objectives.length > 0 ? (
          <ul className="objectives-list">
            {task.objectives.map((obj) => (
              <li key={obj.objectiveId} className={`objective-item ${obj.isCompleted ? 'completed' : ''}`}>
                <label className="objective-label">
                  <input
                    type="checkbox"
                    checked={!!obj.isCompleted}
                    onChange={() => handleToggleObjective(obj.objectiveId)}
                    className="objective-checkbox"
                  />
                  <span className="objective-text">{obj.description}</span>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-objectives">Sin objetivos específicos para esta misión.</p>
        )}
      </div>

    </div>
  );
}

export { PomodoroTimer };
