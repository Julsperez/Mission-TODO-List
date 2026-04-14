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
		if (!isActive) {
			clearInterval(timerRef.current);
			return;
		}
		timerRef.current = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(timerRef.current);
					setIsActive(false);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => clearInterval(timerRef.current);
	}, [isActive]);

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
