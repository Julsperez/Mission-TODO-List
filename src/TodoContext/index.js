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
	} = useLocalStorage('defaultTodosV1', []); // guardar defaultTodosV1 en archivo .env como TODOS_KEY

	// Componente padre debe manejar los estados de los componentes hijos
	const [searchValue, setSearchValue] = React.useState('');
	const [openTaskModal, setOpenTaskModal] = React.useState(false);
	const [isEditTask, setIsEditTask] = React.useState(false);
	const [isShowTaskInfo, setIsShowTaskInfo] = React.useState(false);
	const [task, setTask] = React.useState({});
	const [isShowPomodoro, setIsShowPomodoro] = React.useState(false);

	// Estados derivados, son variables calculadas a partir de otros estados
	const totalTodos = todos.length;
	const completedTodos = todos.filter(todo => !!todo.isCompleted && todo.status !== "archived").length;
	const searchedTodos = React.useMemo(
		() => todos.filter(todo =>
			todo.title.toLowerCase().includes(searchValue.toLowerCase())
		),
		[todos, searchValue]
	);

	const updateTodo = React.useCallback((updatedTodo) => {
		setTodos(prev => prev.map(t =>
			t.missionId === updatedTodo.missionId ? updatedTodo : t
		));
	}, [setTodos]);

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