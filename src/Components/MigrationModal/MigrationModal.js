import React from 'react';
import { useAuth } from '../../Hooks/useAuth';
import { TodoContext } from '../../TodoContext';
import { todosService } from '../../services/todosService';
import { Modal } from '../Modal/Modal';
import './MigrationModal.css';

function MigrationModal() {
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
						<h2 className="migrationModal__title">Misiones locales encontradas</h2>
						<p className="migrationModal__body">
							Se encontraron{' '}
							<span className="migrationModal__count">{count}</span>{' '}
							{count === 1 ? 'misión guardada localmente' : 'misiones guardadas localmente'}.
							¿Deseas importarlas a tu cuenta?
						</p>
						<div className="migrationModal__actions">
							<button
								className="migrationModal__btn migrationModal__btn--secondary"
								onClick={handleSkip}
							>
								Omitir
							</button>
							<button
								className="migrationModal__btn migrationModal__btn--primary"
								onClick={handleImport}
							>
								Importar misiones
							</button>
						</div>
					</>
				)}

				{status === 'loading' && (
					<>
						<h2 className="migrationModal__title">Importando misiones...</h2>
						<div className="migrationModal__spinner" aria-label="Cargando" />
					</>
				)}

				{status === 'done' && (
					<>
						<h2 className="migrationModal__title">¡Importación completada!</h2>
						<p className="migrationModal__result">
							<span className="migrationModal__count">{result?.imported ?? 0}</span> importadas
							{' · '}
							<span>{result?.skipped ?? 0}</span> omitidas
						</p>
						<div className="migrationModal__actions">
							<button
								className="migrationModal__btn migrationModal__btn--primary"
								onClick={handleClose}
							>
								Continuar
							</button>
						</div>
					</>
				)}

				{status === 'error' && (
					<>
						<h2 className="migrationModal__title">Error al importar</h2>
						<p className="migrationModal__body">
							No se pudo conectar con el servidor. Tus misiones locales siguen guardadas.
						</p>
						<div className="migrationModal__actions">
							<button
								className="migrationModal__btn migrationModal__btn--secondary"
								onClick={handleSkip}
							>
								Omitir
							</button>
							<button
								className="migrationModal__btn migrationModal__btn--primary"
								onClick={() => setStatus('idle')}
							>
								Reintentar
							</button>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
}

export { MigrationModal };
