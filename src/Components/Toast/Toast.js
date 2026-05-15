import React from 'react';
import './Toast.css';

function Toast({ message, type = 'error', onDismiss }) {
	React.useEffect(() => {
		const id = setTimeout(onDismiss, 3000);
		return () => clearTimeout(id);
	}, [onDismiss]);

	return (
		<div className={`toast toast--${type}`} role="alert" aria-live="assertive">
			<span className="toast__message">{message}</span>
			<button className="toast__close" onClick={onDismiss} aria-label="Cerrar">✕</button>
		</div>
	);
}

export { Toast };
