import React from 'react';
import { usePomodoro } from '../../Hooks/usePomodoro';
import { HiOutlinePlay, HiOutlinePause, HiOutlineRefresh } from 'react-icons/hi';
import './PomodoroTimer.css';

function PomodoroTimer({ taskName }) {
    const { isActive, toggleTimer, resetTimer, formatTime } = usePomodoro();

    return (
        <div className="pomodoro-container">
            <h2 className="pomodoro-title">Misión: {taskName}</h2>
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
                {isActive ? 'Enfocado en la misión...' : 'Listo para el despegue'}
            </p>
        </div>
    );
}

export { PomodoroTimer };
