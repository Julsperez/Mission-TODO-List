import React, { useState } from "react";
import { TodoContext } from "../../TodoContext";

import "./TodoForm.css";

function TodoForm({ onSubmit, editView, task, onCancel }) {
  const { setOpenTaskModal } = React.useContext(TodoContext);
  const generateRandomId = () => Math.floor(Math.random() * 1000000);
  const [formData, setFormData] = useState({
    missionId: generateRandomId(),
    title: "",
    subtitle: "",
    description: "",
    isCompleted: false,
    status: "in-progress",
    typeofMission: "main",
    objectives: []
  });

  
  React.useEffect(() => {
    if (editView && Object.keys(task).length !== 0) {
      setFormData({...task});
    }
  }, [task]);


  const [newObjective, setNewObjective] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      const objective = {
        objectiveId: formData.objectives.length + 1,
        missionId: formData.missionId,
        description: newObjective,
        isCompleted: false
      };
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, objective]
      }));
      setNewObjective("");
    }
  };

  const handleRemoveObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      if (onSubmit) onSubmit(formData, editView);
      setOpenTaskModal(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <form className="todoFormContainer" onSubmit={handleSubmit}>
      <h2 className="todoForm-title">
        {editView ? "Editar Misión" : "Crear Nueva Misión"}
      </h2>
      
      <div className="formBodyContainer">
        {/* Basic Info Section */}
        <div className="todoForm-section">
          <h3 className="todoForm-sectionTitle">Información Básica</h3>
          
          <div className="todoForm-group">
            <label htmlFor="title" className="todoForm-label">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: Diseño de Proyecto"
              className="todoForm-input"
              required
            />
          </div>

          <div className="todoForm-group">
            <label htmlFor="subtitle" className="todoForm-label">Subtítulo</label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleInputChange}
              placeholder="Ej: Planificación General"
              className="todoForm-input"
            />
          </div>

          <div className="todoForm-group">
            <label htmlFor="description" className="todoForm-label">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe detalladamente la misión"
              className="todoForm-textarea"
              rows="4"
            ></textarea>
          </div>
        </div>

        {/* Status Section */}
        <div className="todoForm-section">
          <h3 className="todoForm-sectionTitle">Estado</h3>
          
          <div className="todoForm-group">
            <label htmlFor="typeofMission" className="todoForm-label">Tipo de Misión</label>
            <select
              id="typeofMission"
              name="typeofMission"
              value={formData.typeofMission}
              onChange={handleInputChange}
              className="todoForm-select"
            >
              <option value="main">Principal (Main)</option>
              <option value="side">Secundaria (Side)</option>
            </select>
          </div>

          <div className="todoForm-group">
            <label htmlFor="status" className="todoForm-label">Estado</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="todoForm-select"
            >
              <option value="in-progress">En Progreso</option>
              <option value="completed">Completado</option>
              <option value="archived">Archivado</option>
            </select>
          </div>

          <div className="todoForm-group todoForm-checkboxGroup">
            <label htmlFor="isCompleted" className="todoForm-checkboxLabel">
              <input
                type="checkbox"
                id="isCompleted"
                name="isCompleted"
                checked={formData.isCompleted}
                onChange={handleInputChange}
                className="todoForm-checkbox"
              />
              <span>Marcar como completado</span>
            </label>
          </div>
        </div>

        {/* Objectives Section */}
        <div className="todoForm-section">
          <h3 className="todoForm-sectionTitle">Objetivos</h3>
          
          <div className="todoForm-objectivesInput">
            <input
              type="text"
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddObjective()}
              placeholder="Añade un objetivo (Enter para confirmar)"
              className="todoForm-input"
            />
            <button
              type="button"
              onClick={handleAddObjective}
              className="todoForm-button addObjective"
            >
              + Añadir
            </button>
          </div>

          <div className="todoForm-objectivesList">
            {formData.objectives.map((objective, index) => (
              <div key={index} className="todoForm-objectiveItem">
                <span className="objectiveIndex">{index + 1}.</span>
                <span className="objectiveDescription">{objective.description}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveObjective(index)}
                  className="todoForm-removeObjective"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
      {/* Action Buttons */}
      <div className="todoForm-actions">
        <button
          type="button"
          onClick={handleCancel}
          className="todoForm-button cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="todoForm-button confirm"
        >
          {editView ? "Editar Misión" : "Crear Misión"}
        </button>
      </div>
    </form>
  );
}

export { TodoForm };