import "./CreateTodoButton.css";
function CreateTodoButton({setOpenTaskModal}) {
  return (
    <button
      aria-label="Crear nueva misión"
      className="createTodoButton"
      onClick={() => setOpenTaskModal(true)}>
      +
    </button>
  );
}

export { CreateTodoButton };