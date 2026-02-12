import "./CreateTodoButton.css";
function CreateTodoButton({setOpenTaskModal}) {
  return (
    <button 
      className="createTodoButton" 
      onClick={() => setOpenTaskModal(true)}>
      +
    </button>
  );
}

export { CreateTodoButton };