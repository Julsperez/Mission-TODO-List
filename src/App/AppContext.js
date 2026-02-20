import React from "react";
import { HiOutlineXCircle } from "react-icons/hi";
import { TodoContext } from "../TodoContext";
import { 
	CreateTodoButton, 
	TodoCounter, 
	TodoList, 
	TodoSearch, 
	Modal,
  TodoForm,
  TodoShowInfo
} from '../Components';
import "./App.css"

function AppContext() {
  const {
    error,
    loading,
    searchedTodos,
    todos,
    setTodos,
    openTaskModal,
    setOpenTaskModal,
    isEditTask,
    setIsEditTask,
    isShowTaskInfo,
    setIsShowTaskInfo,
    task,
    setTask
	} = React.useContext(TodoContext);

	const handleCloseModal = () => {
		setOpenTaskModal(false);
		setIsEditTask(false);
		setIsShowTaskInfo(false);
		setTask({});
	};

  const handleSubmitTodo = (newTodo, isEditFlag) => {
    let updatedTodos;
    if (isEditFlag) {
      updatedTodos = todos.map(todo =>
        todo.missionId === newTodo.missionId ? newTodo : todo
      );
    } else {
      updatedTodos = [newTodo, ...todos];
    }
    setTodos(updatedTodos);
    handleCloseModal();
  };

	return (
		<div id="app-container" className='AppContainer'>
			{loading ? 
        <h2 className='appLoadingMessage'>Cargando datos de misiones...</h2> :
			error ? 
        <h2 className='appLoadingMessage'>Hubo un error al cargar las misiones.</h2> : 
      (
				<>
					
					<div className='appContainerHeader'>
						<TodoCounter/>
					</div>
					{
						!!searchedTodos.length ? (
							<TodoList/>
						): <h2 className='appLoadingMessage'>¡Crea tu primera misión espacial!</h2>
					}
					<CreateTodoButton setOpenTaskModal={setOpenTaskModal}/>
          <TodoSearch/>
					{openTaskModal && (
						<Modal>
							<div className="modalButton">
                <button onClick={handleCloseModal} className="closeButtonModal">
                  <HiOutlineXCircle/>
                </button>
              </div>
							{isShowTaskInfo ? (
                <TodoShowInfo 
                  task={task} 
                  onClose={handleCloseModal} 
                  onEdit={() => setIsEditTask(true)}
                />
							) : 
                <TodoForm 
                  task={task} 
                  editView={isEditTask} 
                  onSubmit={handleSubmitTodo}
                  onCancel={handleCloseModal}
                />
              }
						</Modal>
					)}
          
				</>
			)}
		</div>
	);
}

export { AppContext };