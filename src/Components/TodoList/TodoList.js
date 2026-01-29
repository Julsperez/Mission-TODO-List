import { TodoItem } from "../TodoItem/TodoItem";
import "./TodoList.css";

function ListDivider({ dividerText }) {
  return (
    <div className="listDivider">
      <h3 className="dividerText">{dividerText}</h3>
      <span className="dividerLine"></span>
    </div>
  )
}

function TodoList({ todos }) {

  // remove missions from main and side if they are completed
  const mainMissions = todos.filter(todo => todo.typeofMission === "main");
  const sideMissions = todos.filter(todo => todo.typeofMission === "side");
  const completedMissions = todos.filter(todo => todo.isCompleted);


  return (
    <div className="todoListContainer">

      <ListDivider dividerText={"Misiones principales"}/>
      {
        (!!mainMissions.length ? (
          <>
            {mainMissions.map(todo => (
              <TodoItem key={todo.missionId} todo={todo}/>
            ))}
          </>
        ): null )
      }

      <ListDivider dividerText={"Misiones secundarias"}/>
      {
        (!!sideMissions.length ? (
          <>
            {sideMissions.map(todo => (
              <TodoItem key={todo.missionId} todo={todo}/>
            ))}
          </>
        ): null )
      }

      <ListDivider dividerText={"Misiones completadas"}/>
      {
        (!!completedMissions.length ? (
          <>
            {completedMissions.map(todo => (
              <TodoItem key={todo.missionId} todo={todo}/>
            ))}
          </>
        ): null )
      }
      
    </div>
  );
}

export { TodoList };