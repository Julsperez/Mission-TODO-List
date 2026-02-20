
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

  const handleSelectedOption = (option) => {
    let updatedTodo = { ...todo };
    if (option === "complete" && !updatedTodo.isCompleted) {
      updatedTodo.isCompleted = true;
    }
    if (option === "active") {
      updatedTodo.isCompleted = false;
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
          ${todo.typeofMission === "side" ? "side" : "main"}
          ${todo.status === "archived" && "archived"}
        `}>
          {todo.typeofMission}
        </span>
        <OverflowMenu 
          todoItem={todo}
          onSelectedOption={handleSelectedOption}
        />
      </div>
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
    </div>
  );
}

export { TodoItem };