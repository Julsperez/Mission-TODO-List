import React, { useContext } from 'react';
import { usePomodoro } from '../../Hooks/usePomodoro';
import { TodoContext } from '../../TodoContext';
import { HiOutlinePlay, HiOutlinePause, HiOutlineRefresh } from 'react-icons/hi';
import './PomodoroTimer.css';

function PomodoroTimer({ task }) {
  const { toggleObjective } = useContext(TodoContext);

  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleComplete = React.useCallback(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('¡Misión completada!', { body: task.title });
    }
  }, [task.title]);

  const { isActive, toggleTimer, resetTimer, formatTime } = usePomodoro(25, handleComplete);

  return (
    <div className="pomodoro-container">
      <h2 id="modal-title" className="pomodoro-title">{task.title}</h2>
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
                    onChange={() => toggleObjective(task.missionId, obj.objectiveId)}
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
