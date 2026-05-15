
import React from "react";
import { TodoContext } from "../../TodoContext";
import { OverflowMenu } from "../";
import "./TodoItem.css";

function TodoItem({ todo, onItemUpdated }) {
  const { 
    setOpenTaskModal, 
    setIsShowTaskInfo, 
    setTask 
  } = React.useContext(TodoContext);

  const today = new Date().toISOString().split('T')[0];
  const dueDateStr = todo.dueDate ? todo.dueDate.split('T')[0] : null;
  const isOverdue = dueDateStr && todo.status !== 'completed' && dueDateStr < today;
  const totalObjectives = (todo.objectives || []).length;
  const completedObjectives = (todo.objectives || []).filter(o => o.isCompleted).length;

  const handleSelectedOption = (option) => {
    let updatedTodo = { ...todo };
    if (option === "complete" && !updatedTodo.isCompleted) {
      updatedTodo.status = "completed";
    }
    if (option === "active") {
      updatedTodo.status = "in-progress";
    }
    if (option === "archive") {
      updatedTodo.status = "archived";
    }
    if (option === "delete") {
      updatedTodo.status = "deleted";
    }
    onItemUpdated(updatedTodo);
  };

  const handleSelectedItem = () => {
    setOpenTaskModal(true);
    setIsShowTaskInfo(true);
    setTask(todo);
  };

  return (
    <div 
      onClick={handleSelectedItem}
      className={`missionCard ${todo.status === "archived" && "archived"}`}>
      <div className="missionCard-header">
        <span className={`
          missionLabel 
          ${todo.typeofMission === 'side' ? 'side' : 'main'}
          ${todo.status === "archived" && "archived"}
        `}>
          {todo.typeofMission === 'side' ? 'Secundaria' : 'Principal'}
        </span>
        <OverflowMenu 
          todoItem={todo}
          onSelectedOption={handleSelectedOption}
        />
      </div>
      {isOverdue && <span className="overdue-badge">Vencida</span>}
      <h3
        className={
          `missionCard-title ${
            todo.isCompleted &&
            "completed"}`}>
          {todo.title}
        </h3>
      <p
        className={
          `missionCard-subtitle ${
            todo.isCompleted &&
            "completed"}`}>
          {todo.subtitle}
        </p>
      {totalObjectives > 0 && (
        <p className="missionCard-objectives">
          {completedObjectives} de {totalObjectives} objetivos
        </p>
      )}
    </div>
  );
}

export { TodoItem };