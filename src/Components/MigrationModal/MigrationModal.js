import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Hooks/useAuth';
import { TodoContext } from '../../TodoContext';
import { todosService } from '../../services/todosService';
import { Modal } from '../Modal/Modal';
import './MigrationModal.css';

function MigrationModal() {
	const { t } = useTranslation();
	const { pendingMigrationTodos, clearPendingMigration } = useAuth();
	const { refreshTodos } = React.useContext(TodoContext);
	const [status, setStatus] = React.useState('idle');
	const [result, setResult] = React.useState(null);

	if (!pendingMigrationTodos) return null;

	const count = pendingMigrationTodos.length;

	const handleImport = async () => {
		setStatus('loading');
		try {
			const data = await todosService.migrateTodos(pendingMigrationTodos);
			setResult(data);
			setStatus('done');
		} catch {
			setStatus('error');
		}
	};

	const handleSkip = () => clearPendingMigration();

	const handleClose = () => {
		clearPendingMigration();
		refreshTodos();
	};

	return (
		<Modal onClose={status === 'done' ? handleClose : handleSkip}>
			<div className="migrationModal">
				<div className="migrationModal__icon">🚀</div>

				{status === 'idle' && (
					<>
						<h2 className="migrationModal__title">{t('migration.title_idle')}</h2>
						<p className="migrationModal__body">
							{t('migration.body_idle', { count })}
						</p>
						<div className="migrationModal__actions">
							<button
								className="migrationModal__btn migrationModal__btn--secondary"
								onClick={handleSkip}
							>
								{t('migration.btn_skip')}
							</button>
							<button
								className="migrationModal__btn migrationModal__btn--primary"
								onClick={handleImport}
							>
								{t('migration.btn_import')}
							</button>
						</div>
					</>
				)}

				{status === 'loading' && (
					<>
						<h2 className="migrationModal__title">{t('migration.title_loading')}</h2>
						<div className="migrationModal__spinner" aria-label={t('common.loading')} />
					</>
				)}

				{status === 'done' && (
					<>
						<h2 className="migrationModal__title">{t('migration.title_done')}</h2>
						<p className="migrationModal__result">
							{t('migration.result', { imported: result?.imported ?? 0, skipped: result?.skipped ?? 0 })}
						</p>
						<div className="migrationModal__actions">
							<button
								className="migrationModal__btn migrationModal__btn--primary"
								onClick={handleClose}
							>
								{t('migration.btn_continue')}
							</button>
						</div>
					</>
				)}

				{status === 'error' && (
					<>
						<h2 className="migrationModal__title">{t('migration.title_error')}</h2>
						<p className="migrationModal__body">
							{t('migration.body_error')}
						</p>
						<div className="migrationModal__actions">
							<button
								className="migrationModal__btn migrationModal__btn--secondary"
								onClick={handleSkip}
							>
								{t('migration.btn_skip')}
							</button>
							<button
								className="migrationModal__btn migrationModal__btn--primary"
								onClick={() => setStatus('idle')}
							>
								{t('migration.btn_retry')}
							</button>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
}

export { MigrationModal };
