import React from "react";
import { TodoContext } from "../TodoContext";
import { 
	CreateTodoButton, 
	TodoCounter, 
	TodoList, 
	TodoSearch, 
	Modal
} from '../Components';
import "./App.css"

function AppContext() {
  const { 
		loading, 
		error, 
		searchedTodos, 
		openTaskModal, 
		setOpenTaskModal, 
		isEditTask, 
		setIsEditTask, 
		isShowTaskInfo, 
		setIsShowTaskInfo,
		setTask,
		task
	} = React.useContext(TodoContext);

	const handleCloseModal = () => {
		setOpenTaskModal(false);
		setIsEditTask(false);
		setIsShowTaskInfo(false);
		setTask({});
	};

	return (
		<div id="app-container" className='AppContainer'>
			{loading ? (
				<h2 className='appLoadingMessage'>Cargando datos de misiones...</h2>
			) :
			error ? (
				<h2 className='appLoadingMessage'>Hubo un error al cargar las misiones.</h2> 
			) : (
				<>
					<TodoSearch/>
					<div className='appContainerHeader'>
						<TodoCounter/>
					</div>
					{
						!!searchedTodos.length ? (
							<TodoList/>
						): <h2 className='appLoadingMessage'>¡Crea tu primera misión espacial!</h2>
					}
					<CreateTodoButton setOpenTaskModal={setOpenTaskModal}/>

					{openTaskModal && (
						<Modal>
							<button onClick={handleCloseModal}> Close </button>
							{isEditTask ? ( 
								<>
									<p>Form to edit task</p>
									{task && <pre>{JSON.stringify(task, null, 2)}</pre>}
								</>
							) :
							isShowTaskInfo ? (
								<>
									<p>Task info</p>
									{task && <pre>{JSON.stringify(task, null, 2)}</pre>}
								</>
							) : (
								<>
									<p>Form to create new task</p>
									
								</>
							)}
						</Modal>
					)}
				</>
			)}
		</div>
	);
}

export { AppContext };