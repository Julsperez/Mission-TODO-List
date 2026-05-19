import React from 'react';
import { useTranslation } from 'react-i18next';
import './Toast.css';

function Toast({ message, type = 'error', onDismiss }) {
	const { t } = useTranslation();
	React.useEffect(() => {
		const id = setTimeout(onDismiss, 3000);
		return () => clearTimeout(id);
	}, [onDismiss]);

	return (
		<div className={`toast toast--${type}`} role="alert" aria-live="assertive">
			<span className="toast__message">{message}</span>
			<button className="toast__close" onClick={onDismiss} aria-label={t('common.close')}>✕</button>
		</div>
	);
}

export { Toast };
