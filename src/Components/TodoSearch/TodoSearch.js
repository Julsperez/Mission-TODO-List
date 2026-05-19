import  React from "react";
import { useTranslation } from 'react-i18next';
import { TodoContext } from "../../TodoContext";
import "./TodoSearch.css";

// function TodoSearch({ searchValue, setSearchValue }) {
function TodoSearch() {
  const { searchValue, setSearchValue } = React.useContext(TodoContext);
  const { t } = useTranslation();
  return (
    <div className="todoSearchContainer">
      <label htmlFor="todo-search" className="sr-only">{t('search.label')}</label>
      <input
        id="todo-search"
        placeholder={t('search.placeholder')}
        className="todoSearchInput"
        value={searchValue}
        onChange={(event) => {
          setSearchValue(event.target.value);
        }}
      />
    </div>
  );
}

export { TodoSearch };