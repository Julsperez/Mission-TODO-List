import  React from "react";
import { TodoContext } from "../../TodoContext";
import "./TodoSearch.css";

// function TodoSearch({ searchValue, setSearchValue }) {
function TodoSearch() {
  const { searchValue, setSearchValue } = React.useContext(TodoContext);
  return (
    <div className="todoSearchContainer">
      <input 
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