
import React from "react";
import { OverflowMenu } from "../OverflowMenu/OverflowMenu";
import "./TodoItem.css";

function TodoItem({ todo, onItemUpdated }) {
  // const showInfo = () => {
  //   console.log("Misión:", todo);
  // };

  // const completeMission = (event) => {
  //   event.stopPropagation();
  //   console.log("Mostrar menú de opciones para la misión:", todo.missionId);
  // }
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
          ${todoItem.status === "archived" ? "side" : "main"}`}>
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