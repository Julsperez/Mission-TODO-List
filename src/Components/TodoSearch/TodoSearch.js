import  React from "react";
import { TodoContext } from "../../TodoContext";
import "./TodoSearch.css";

// function TodoSearch({ searchValue, setSearchValue }) {
function TodoSearch() {
  const { searchValue, setSearchValue } = React.useContext(TodoContext);
  return (
    <div className="todoSearchContainer">
      <label htmlFor="todo-search" className="sr-only">Buscar misiones</label>
      <input
        id="todo-search"
        placeholder="Buscar misión..."
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