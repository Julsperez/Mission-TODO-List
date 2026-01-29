import "./CreateTodoButton.css";
function CreateTodoButton() {
  return (
    <button 
      className="createTodoButton" 
      onClick={
        (event) => {
          console.log(event);
          console.log(event.target);
        }
      }>
      + Nueva misión
    </button>
  );
}

export { CreateTodoButton };