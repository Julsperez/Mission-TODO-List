import React from 'react';

function usePomodoro(initialMinutes = 25) {
	const [timeLeft, setTimeLeft] = React.useState(initialMinutes * 60);
	const [isActive, setIsActive] = React.useState(false);
	const timerRef = React.useRef(null);

	const toggleTimer = () => {
		setIsActive(!isActive);
	};

	const resetTimer = () => {
		setIsActive(false);
		setTimeLeft(initialMinutes * 60);
	};

	React.useEffect(() => {
		if (isActive && timeLeft > 0) {
			timerRef.current = setInterval(() => {
				setTimeLeft((prevTime) => prevTime - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			setIsActive(false);
			clearInterval(timerRef.current);
			// Opcional: Notificar finalización o sonar una alarma
		} else {
			clearInterval(timerRef.current);
		}

		return () => clearInterval(timerRef.current);
	}, [isActive, timeLeft]);

	const formatTime = () => {
		const minutes = Math.floor(timeLeft / 60);
		const seconds = timeLeft % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	return {
		timeLeft,
		isActive,
		toggleTimer,
		resetTimer,
		formatTime,
	};
}

export { usePomodoro };
