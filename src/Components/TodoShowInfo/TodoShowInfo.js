
import React, { useContext } from "react";
import { useTranslation } from 'react-i18next';
import { TodoContext } from "../../TodoContext";
import "./TodoShowInfo.css";

function TodoShowInfo({ task, onClose, onEdit }) {
  const { toggleObjective } = useContext(TodoContext);
  const { t, i18n } = useTranslation();

  if (!task) return null;

  const statusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "archived":
        return "status-archived";
      default:
        return "status-inprogress";
    }
  };

  return (
    <div className="taskInfoContainer">
      <div>
        <h2 id="modal-title" className={`taskTitle ${task.isCompleted ? "completed" : ""}`}>{task.title}</h2>
        {task.subtitle && <p className={`taskSubtitle ${task.isCompleted ? "completed" : ""}`}>{task.subtitle}</p>}
      </div>

      <div className="taskInfoHeader">
        <div className="taskInfoHeadLeft">
          <span className={`missionLabel ${task.typeofMission === "side" ? "side" : "main"}`}>
            {task.typeofMission === 'side' ? t('item.type_side') : t('item.type_main')}
          </span>
          <span className={`statusBadge ${statusClass(task.status)}`}>
            {
              task.status === 'in-progress' ? t('show_info.status_in_progress') :
                task.status === 'completed' ? t('show_info.status_completed') :
                  t('show_info.status_archived')
            }
          </span>
        </div>
        {task.dueDate && (
          <span className="dueDateBadge">
            {t('show_info.due_date', {
              date: new Date(task.dueDate + 'T12:00:00').toLocaleDateString(
                i18n.language === 'en' ? 'en-US' : 'es-ES',
                { day: 'numeric', month: 'long', year: 'numeric' }
              )
            })}
          </span>
        )}
      </div>


      <div className="taskDescription">
        <h3 className="sectionHeading">{t('show_info.desc_heading')}</h3>
        <p>{task.description || t('show_info.desc_empty')}</p>
      </div>

      <div className="taskObjectives">
        <h3 className="sectionHeading">{t('show_info.objectives_heading')}</h3>
        {task.objectives && task.objectives.length > 0 ? (
          <div className="objectivesList">
            {task.objectives.map((obj) => (
              <label key={obj.objectiveId} className={`objectiveRow ${obj.isCompleted ? "objectiveCompleted" : ""}`}>
                <input
                  type="checkbox"
                  checked={!!obj.isCompleted}
                  onChange={() => toggleObjective(task.missionId, obj.objectiveId)}
                  className="objectiveCheckbox"
                />
                <span className="objectiveText">{obj.description}</span>
              </label>
            ))}
          </div>
        ) : (
          <p className="noObjectives">{t('show_info.objectives_empty')}</p>
        )}
      </div>

      <div className="taskFooter">
        <button className="taskBtn secondary" onClick={() => onEdit && onEdit()}>{t('show_info.btn_edit')}</button>
        <button className="taskBtn primary" onClick={onClose}>{t('show_info.btn_close')}</button>
      </div>
    </div>
  );
}

export { TodoShowInfo };