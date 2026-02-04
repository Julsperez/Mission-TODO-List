import "./TodoSearch.css";

function TodoSearch({ searchValue, setSearchValue }) {
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