import React from "react";
import { HiOutlineXCircle } from "react-icons/hi";
import { TodoContext } from "../TodoContext";
import { useAuth } from "../Hooks/useAuth";
import {
  CreateTodoButton,
  TodoCounter,
  TodoList,
  TodoSearch,
  Modal,
  TodoForm,
  TodoShowInfo,
  PomodoroTimer,
  Toast,
  ThemeToggle
} from '../Components';
import "./App.css"

function AppContext() {
  const { logout } = useAuth();
  const {
    error,
    loading,
    searchedTodos,
    updateTodo,
    openTaskModal,
    setOpenTaskModal,
    isEditTask,
    setIsEditTask,
    isShowTaskInfo,
    setIsShowTaskInfo,
    task,
    setTask,
    isShowPomodoro,
    setIsShowPomodoro,
    toast,
    dismissToast
  } = React.useContext(TodoContext);

  const handleCloseModal = () => {
    setOpenTaskModal(false);
    setIsEditTask(false);
    setIsShowTaskInfo(false);
    setIsShowPomodoro(false);
    setTask({});
  };

  const handleSubmitTodo = (newTodo) => {
    updateTodo(newTodo); // fire and forget — el optimistic update ya se aplicó
    handleCloseModal();
  };

  return (
    <div id="app-container" className='AppContainer'>
      {loading ?
        <h2 className='appLoadingMessage'>Cargando datos de misiones...</h2> :
        error ?
          (
            <>
              <h2 className='appLoadingMessage'>Hubo un error al cargar las misiones.</h2> 
              {/* <button onClick={() => alert(localStorage.getItem('defaultTodosV1'))}>Debug button</button> */}
            </>
          ):
          (
            <>

              <div className='appContainerHeader'>
                <TodoCounter />
                <div className="appHeaderActions">
                  <ThemeToggle />
                  <button onClick={logout} className="logoutButton">
                    Cerrar sesión
                  </button>
                </div>
              </div>
              {
                !!searchedTodos.length ? (
                  <TodoList />
                ) : <h2 className='appLoadingMessage'>¡Crea tu primera misión espacial!</h2>
              }
              <CreateTodoButton setOpenTaskModal={setOpenTaskModal} />
              <TodoSearch />
              {openTaskModal && (
                <Modal onClose={handleCloseModal}>
                  <div className="modalButton">
                    <button onClick={handleCloseModal} className="closeButtonModal" aria-label="Cerrar">
                      <HiOutlineXCircle />
                    </button>
                  </div>
                  {isShowTaskInfo ? (
                    <TodoShowInfo
                      task={task}
                      onClose={handleCloseModal}
                      onEdit={() => {
                        setIsEditTask(true);
                        setIsShowTaskInfo(false);
                      }}
                    />
                  ) : isShowPomodoro ? (
                    <PomodoroTimer task={task} />
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
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />}
    </div>
  );
}

export { AppContext };