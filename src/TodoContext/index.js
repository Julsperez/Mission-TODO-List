import React from 'react';
import { useLocalStorage } from './useLocalStorage';

const TodoContext = React.createContext();

function TodoProvider({ children }) {

	// Custom hook para manejar el localStorage
	const {
		item: todos,
		updateItem: setTodos,
		loading,
		error
	} = useLocalStorage(process.env.REACT_APP_TODOS_KEY, []);

	// Componente padre debe manejar los estados de los componentes hijos
	const [searchValue, setSearchValue] = React.useState('');
	const [openTaskModal, setOpenTaskModal] = React.useState(false);
	const [isEditTask, setIsEditTask] = React.useState(false);
	const [isShowTaskInfo, setIsShowTaskInfo] = React.useState(false);
	const [task, setTask] = React.useState({});
	const [isShowPomodoro, setIsShowPomodoro] = React.useState(false);

	// Estados derivados, son variables calculadas a partir de otros estados
	const totalTodos = todos.length;
	const completedTodos = todos.filter(todo => todo.status === 'completed').length;
	const searchedTodos = React.useMemo(
		() => todos.filter(todo =>
			todo.title.toLowerCase().includes(searchValue.toLowerCase())
		),
		[todos, searchValue]
	);

	const updateTodo = React.useCallback((updatedTodo) => {
		const normalized = {
			...updatedTodo,
			isCompleted: updatedTodo.status === 'completed'
		};
		setTodos(prev => {
			const exists = prev.some(t => t.missionId === normalized.missionId);
			return exists
				? prev.map(t => t.missionId === normalized.missionId ? normalized : t)
				: [normalized, ...prev];
		});
	}, [setTodos]);

	const deleteTodo = React.useCallback((missionId) => {
		setTodos(prev => prev.filter(t => t.missionId !== missionId));
	}, [setTodos]);

	const toggleObjective = React.useCallback((missionId, objectiveId) => {
		const todo = todos.find(t => t.missionId === missionId);
		if (!todo) return;
		const updatedTask = {
			...todo,
			objectives: todo.objectives.map(obj =>
				obj.objectiveId === objectiveId
					? { ...obj, isCompleted: !obj.isCompleted }
					: obj
			)
		};
		updateTodo(updatedTask);
		setTask(updatedTask);
	}, [todos, updateTodo, setTask]);

	return (
		<TodoContext.Provider value={{
			completedTodos,
			error,
			loading,
			totalTodos,
			searchedTodos,
			todos,
			setTodos,
			updateTodo,
			deleteTodo,
			toggleObjective,
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