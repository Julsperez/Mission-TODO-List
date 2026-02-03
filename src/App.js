import React from 'react';
import { CreateTodoButton } from './Components/CreateTodoButton/CreateTodoButton';
import { TodoCounter } from './Components/TodoCounter/TodoCounter';
import { TodoList } from './Components/TodoList/TodoList';
import { TodoSearch } from './Components/TodoSearch/TodoSearch';
import './App.css';



// class Objective {
//   objectiveId;
//   missionId;
//   description;
//   isCompleted;
// }

// class Mission {
//   missionId;
//   title;
//   subtitle;
//   description;
//   isCompleted;
//   typeofMission;
//   objectives; // Array of Objective objects
// };

const defaultTodos = [
  {
    missionId: 1,
    title: "Diseño de Proyecto",
    subtitle: "Planificación General",
    description: "Diseñar la arquitectura general del proyecto",
    isCompleted: false,
    status: "in-progress",
    typeofMission: "main",
    objectives: [
      { objectiveId: 1, missionId: 1, description: "Definir alcance del proyecto", isCompleted: false },
      { objectiveId: 2, missionId: 1, description: "Crear diagrama de flujo", isCompleted: false },
    ]
  },
  {
    missionId: 2,
    title: "Diseño de Base de Datos",
    subtitle: "Modelado de Datos",
    description: "Diseñar la estructura de la base de datos",
    isCompleted: true,
    status: "completed",
    typeofMission: "main",
    objectives: [
      { objectiveId: 3, missionId: 2, description: "Crear modelo entidad-relación", isCompleted: false },
      { objectiveId: 4, missionId: 2, description: "Normalizar tablas", isCompleted: false },
    ]
  },
  {
    missionId: 3,
    title: "Toma de Requerimientos",
    subtitle: "Análisis de Requisitos",
    description: "Recopilar y documentar todos los requisitos del cliente",
    isCompleted: false,
    typeofMission: "main",
    status: "in-progress",
    objectives: [
      { objectiveId: 5, missionId: 3, description: "Entrevistar a stakeholders", isCompleted: true },
      { objectiveId: 6, missionId: 3, description: "Documentar requisitos funcionales", isCompleted: true },
    ]
  },
  {
    missionId: 4,
    title: "Desarrollo Frontend",
    subtitle: "Interfaz de Usuario",
    description: "Desarrollar la interfaz de usuario de la aplicación",
    isCompleted: false,
    status: "in-progress",
    typeofMission: "main",
    objectives: [
      { objectiveId: 7, missionId: 4, description: "Crear componentes React", isCompleted: false },
      { objectiveId: 8, missionId: 4, description: "Implementar estilos CSS", isCompleted: false },
    ]
  },
  {
    missionId: 5,
    title: "Implementación",
    subtitle: "Despliegue en Producción",
    description: "Desplegar la aplicación en el servidor de producción",
    isCompleted: true,
    status: "completed",
    typeofMission: "main",
    objectives: [
      { objectiveId: 9, missionId: 5, description: "Configurar servidor", isCompleted: false },
      { objectiveId: 10, missionId: 5, description: "Realizar testing", isCompleted: false },
    ]
  }
];

const getCompletedTodos = (todos) => {
  return todos.filter(todo => !!todo.isCompleted).length;
};

const matchByTitle = (todos, searchValue) => {
  return todos.filter(todo => 
    todo.title.toLowerCase().includes(searchValue.toLowerCase())
  );
}

function App() {
  // Componente padre debe manejar los estados de los componentes hijos
  const [todos, setTodos] = React.useState(defaultTodos);
  const [searchValue, setSearchValue] = React.useState(''); 
  
  // Estados derivados, son variables calculadas a partir de otros estados
  const totalTodos = todos.length;
  const completedTodos = getCompletedTodos(todos);
  const searchedTodos = matchByTitle(todos, searchValue);

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
        setTodos={setTodos}
        searchedTodos={searchedTodos}
      />
      <CreateTodoButton />
    </div>
  );
}

export default App;
