import React from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiOutlineXCircle, HiOutlineCog } from "react-icons/hi";
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
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
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
        <h2 className='appLoadingMessage'>{t('app.loading')}</h2> :
        error ?
          (
            <>
              <h2 className='appLoadingMessage'>{t('app.error')}</h2> 
              {/* <button onClick={() => alert(localStorage.getItem('defaultTodosV1'))}>Debug button</button> */}
            </>
          ):
          (
            <>

              <div className='appContainerHeader'>
                <TodoCounter />
                <div className="appHeaderActions">
                  <button onClick={() => navigate('/settings')} className="settingsButton" aria-label={t('app.settings_aria')} title={t('app.settings_aria')}>
                    <HiOutlineCog aria-hidden="true" />
                  </button>
                  <ThemeToggle />
                  <button onClick={logout} className="logoutButton">
                    {t('app.logout')}
                  </button>
                </div>
              </div>
              {
                !!searchedTodos.length ? (
                  <TodoList />
                ) : <h2 className='appLoadingMessage'>{t('app.empty_state')}</h2>
              }
              <CreateTodoButton setOpenTaskModal={setOpenTaskModal} />
              <TodoSearch />
              {openTaskModal && (
                <Modal onClose={handleCloseModal}>
                  <div className="modalButton">
                    <button onClick={handleCloseModal} className="closeButtonModal" aria-label={t('common.close')}>
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