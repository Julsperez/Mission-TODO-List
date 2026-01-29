import React from "react";
import "./TodoSearch.css";

function TodoSearch() {
  const [searchValue, setSearchValue] = React.useState('');

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
      <span className="todoSearchBorder"></span>
    </div>
  );
}

export { TodoSearch };