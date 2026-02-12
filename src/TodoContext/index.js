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

	const matchByTitle = (todos, searchValue) => {
		return todos.filter(todo => 
			todo.title.toLowerCase().includes(searchValue.toLowerCase())
		);
	}

	// Componente padre debe manejar los estados de los componentes hijos
  const [searchValue, setSearchValue] = React.useState(''); 
	const [openTaskModal, setOpenTaskModal] = React.useState(false);
	const [isEditTask, setIsEditTask] = React.useState(false);
	const [isShowTaskInfo, setIsShowTaskInfo] = React.useState(false);
	const [task, setTask] = React.useState({});

	// Estados derivados, son variables calculadas a partir de otros estados
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => !!todo.isCompleted).length;
  const searchedTodos = matchByTitle(todos, searchValue);

	return (
		<TodoContext.Provider value={{
			todos,
			setTodos,
			loading,
			error,
			searchValue,
			setSearchValue,
			totalTodos,
			completedTodos,
			searchedTodos,
			openTaskModal,
			setOpenTaskModal,
			isEditTask,
			setIsEditTask,
			isShowTaskInfo,
			setIsShowTaskInfo,
			task,
			setTask
		}}>
			{children}
		</TodoContext.Provider>
	);
}

export { TodoContext, TodoProvider };