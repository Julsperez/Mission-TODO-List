import React from 'react';
import { useLocalStorage } from './useLocalStorage';
import { 
  CreateTodoButton, 
  TodoCounter, 
  TodoList, 
  TodoSearch 
} from '../Components';
import './App.css';


const TODOS_KEY = 'defaultTodosV1'; // guardar en archivo .env

const getCompletedTodos = (todos) => {
  return todos.filter(todo => !!todo.isCompleted).length;
};

const matchByTitle = (todos, searchValue) => {
  return todos.filter(todo => 
    todo.title.toLowerCase().includes(searchValue.toLowerCase())
  );
}

function App() {
  // Custom Hooks
  // Custom hook para manejar el localStorage
  const [todos, setTodos] = useLocalStorage(TODOS_KEY, []);

  // Componente padre debe manejar los estados de los componentes hijos
  const [searchValue, setSearchValue] = React.useState(''); 
  
  // Estados derivados, son variables calculadas a partir de otros estados
  const totalTodos = todos.length;
  const completedTodos = getCompletedTodos(todos);
  const searchedTodos = matchByTitle(todos, searchValue);

  // Metodos de logica de componente
  // ...

  return (
    <div id="app-container" className='AppContainer'>
      <TodoSearch 
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <div className='appContainerHeader'>
        <TodoCounter 
          completedTodos={completedTodos} 
          totalTodos={totalTodos} 
        />
      </div>
      <TodoList
        onTodoUpdated={setTodos}
        searchedTodos={searchedTodos}
      />
      <CreateTodoButton />
    </div>
  );
}

export default App ;
