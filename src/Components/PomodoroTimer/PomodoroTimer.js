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

  const [selectedDuration, setSelectedDuration] = React.useState(25);
  const { isActive, toggleTimer, resetTimer, formatTime } = usePomodoro(selectedDuration, handleComplete);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { resetTimer(); }, [selectedDuration]);

  return (
    <div className="pomodoro-container">
      <h2 id="modal-title" className="pomodoro-title">{task.title}</h2>
      <p className="pomodoro-description">
        <span>{!!task.subtitle ? `${task.subtitle}` : ""}</span>
        <span>{!!task.description ? `${task.description}` : ""}</span>
      </p>
      <div className="pomodoro-duration-selector">
        {[15, 25, 50].map(mins => (
          <button
            key={mins}
            className={`duration-btn ${selectedDuration === mins ? 'active' : ''}`}
            onClick={() => setSelectedDuration(mins)}
          >
            {mins} min
          </button>
        ))}
      </div>
      <div className="pomodoro-timer">
        <span className="pomodoro-timer-minutes">{formatTime().split(':')[0]}</span>
        <span className="pomodoro-timer-seconds">{formatTime().split(':')[1]}</span>
      </div>
      <p className="pomodoro-status">
        {isActive ? 'Enfocado en la tarea...' : 'Listo para iniciar tarea'}
      </p>
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

      <div className='pomodoro-objectives'>
        <h3 className="objectives-heading">Objetivos</h3>
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
