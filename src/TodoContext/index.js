import React from 'react';
import { todosService } from '../services/todosService';

const TodoContext = React.createContext();

function TodoProvider({ children }) {

	const [todos, setTodos] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState(false);
	const [toast, setToast] = React.useState(null);

	const [searchValue, setSearchValue] = React.useState('');
	const [openTaskModal, setOpenTaskModal] = React.useState(false);
	const [isEditTask, setIsEditTask] = React.useState(false);
	const [isShowTaskInfo, setIsShowTaskInfo] = React.useState(false);
	const [task, setTask] = React.useState({});
	const [isShowPomodoro, setIsShowPomodoro] = React.useState(false);

	React.useEffect(() => {
		todosService.getTodos()
			.then(data => setTodos(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	}, []);

	const showToast = React.useCallback((message, type = 'error') => {
		setToast({ message, type });
	}, []);

	const dismissToast = React.useCallback(() => setToast(null), []);

	const totalTodos = todos.filter(todo => todo.status !== 'archived').length;
	const completedTodos = todos.filter(todo => todo.status === 'completed').length;
	const searchedTodos = React.useMemo(
		() => todos.filter(todo =>
			todo.title.toLowerCase().includes(searchValue.toLowerCase())
		),
		[todos, searchValue]
	);

	const updateTodo = React.useCallback(async (updatedTodo) => {
		const normalized = {
			...updatedTodo,
			isCompleted: updatedTodo.status === 'completed',
		};
		const isNew = !todos.some(t => t.missionId === normalized.missionId);
		const prevTodos = todos;

		setTodos(prev =>
			isNew
				? [normalized, ...prev]
				: prev.map(t => t.missionId === normalized.missionId ? normalized : t)
		);

		try {
			const saved = isNew
				? await todosService.createTodo(normalized)
				: await todosService.updateTodo(normalized);

			if (isNew && saved?.missionId && saved.missionId !== normalized.missionId) {
				setTodos(prev =>
					prev.map(t => t.missionId === normalized.missionId ? saved : t)
				);
			}
		} catch {
			setTodos(prevTodos);
			showToast('No se pudo guardar la misión. Inténtalo de nuevo.');
		}
	}, [todos, showToast]);

	const deleteTodo = React.useCallback(async (missionId) => {
		const prevTodos = todos;
		setTodos(prev => prev.filter(t => t.missionId !== missionId));
		try {
			await todosService.deleteTodo(missionId);
		} catch {
			setTodos(prevTodos);
			showToast('No se pudo borrar la misión. Inténtalo de nuevo.');
		}
	}, [todos, showToast]);

	const refreshTodos = React.useCallback(() => {
		setLoading(true);
		todosService.getTodos()
			.then(data => setTodos(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	}, []);

	const toggleObjective = React.useCallback(async (missionId, objectiveId) => {
		const todo = todos.find(t => t.missionId === missionId);
		if (!todo) return;
		const updatedTask = {
			...todo,
			objectives: todo.objectives.map(obj =>
				obj.objectiveId === objectiveId
					? { ...obj, isCompleted: !obj.isCompleted }
					: obj
			),
		};
		await updateTodo(updatedTask);
		setTask(updatedTask);
	}, [todos, updateTodo]);

	return (
		<TodoContext.Provider value={{
			completedTodos,
			error,
			loading,
			totalTodos,
			searchedTodos,
			todos,
			updateTodo,
			deleteTodo,
			toggleObjective,
			refreshTodos,
			toast,
			showToast,
			dismissToast,
			searchValue,
			setSearchValue,
			openTaskModal,
			setOpenTaskModal,
			isEditTask,
			setIsEditTask,
			isShowTaskInfo,
			setIsShowTaskInfo,
			task,
			setTask,
			isShowPomodoro,
			setIsShowPomodoro
		}}>
			{children}
		</TodoContext.Provider>
	);
}

export { TodoContext, TodoProvider };
