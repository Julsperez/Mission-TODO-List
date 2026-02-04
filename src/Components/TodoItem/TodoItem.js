
import React from "react";
import { OverflowMenu } from "../OverflowMenu/OverflowMenu";
import "./TodoItem.css";

function TodoItem({ todo, onItemUpdated }) {
  const [todoItem, setTodoItem] = React.useState(todo);
  const handleSelectedOption = (option) => {
    if (option === "complete" && !todoItem.isCompleted) {
      todoItem.isCompleted = true;
    }
    if (option === "active") {
      todoItem.isCompleted = false;
      todoItem.status = "in-progress"; // create status type: todoItem.status = Item.COMPLETED
    }
    if (option === "archive") {
      todoItem.status = "archived";
    }

    setTodoItem({...todoItem});
    onItemUpdated(todoItem);
  }

  return (
    // Agregar doble elipsis de drag and drop
    <div className={`missionCard ${todoItem.status === "archived" && "archived"}`}>
      <div className="missionCard-header">
        <span className={`
          missionLabel 
          ${todoItem.typeofMission === "side" ? "side" : "main"}
          ${todoItem.status === "archived" && "archived"}
        `}>
          {todoItem.typeofMission}
        </span>
        <OverflowMenu 
          todoItem={todoItem}
          onSelectedOption={handleSelectedOption} 
        />
      </div>
      <h3 
        className={
          `missionCard-title ${
            todoItem.isCompleted && 
            "completed"}`}>
          {todoItem.title}
        </h3>
      <p 
        className={
          `missionCard-subtitle ${
            todoItem.isCompleted && 
            "completed"}`}>
          {todoItem.subtitle}
        </p>
    </div>
  );
}

export { TodoItem };