import React from "react";
import { useTranslation } from 'react-i18next';
import "./TodoCounter.css";
import { TodoContext } from "../../TodoContext";

// function TodoCounter({completedTodos, totalTodos}) {
function TodoCounter() {
  const { t } = useTranslation();
  const { completedTodos, totalTodos } = React.useContext(TodoContext);
  return (
    <>
      {
        totalTodos === 0 ? (
          <>
            <h1 className="todoTitle">{t('counter.welcome_title')}</h1>
            <p className="adviceText">{t('counter.welcome_advice')}</p>
          </>
        ) :
        completedTodos === 0 ? (
          <>
            <h1 className="todoTitle">{t('counter.none_completed_title')}</h1>
            <p className="adviceText">{t('counter.none_completed_advice')}</p>
          </>
        ) : completedTodos === totalTodos ? (
          <>
            <h1 className="todoTitle">{t('counter.all_completed_title')}</h1>
            <p className="adviceText">{t('counter.all_completed_advice')}</p>
          </>
        ) : (
          <>
            <h1 className="todoTitle">{t('counter.partial_title', { completed: completedTodos, total: totalTodos })}</h1>
            <p className="adviceText">{t('counter.partial_advice')}</p>
          </>
        )
      }
      {totalTodos > 0 && (
        <div
          className="progressBarContainer"
          aria-label={t('counter.progress_aria', { completed: completedTodos, total: totalTodos })}
        >
          <div
            className="progressBar"
            style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
          />
        </div>
      )}
    </>

  );
}

export { TodoCounter };