import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TodoContext } from '../../TodoContext';
import { TodoForm } from './TodoForm';

const mockCtx = { openTaskModal: true };

const renderForm = (props = {}) =>
  render(
    <TodoContext.Provider value={mockCtx}>
      <TodoForm onSubmit={jest.fn()} onCancel={jest.fn()} {...props} />
    </TodoContext.Provider>
  );

describe('TodoForm — modo creación', () => {
  it('muestra el título "Crear Nueva Misión"', () => {
    renderForm();
    expect(screen.getByText('Crear Nueva Misión')).toBeInTheDocument();
  });

  it('no llama onSubmit si el título está vacío', () => {
    const onSubmit = jest.fn();
    renderForm({ onSubmit });
    fireEvent.click(screen.getByText('Crear Misión'));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('llama onSubmit con el título correcto al hacer submit válido', () => {
    const onSubmit = jest.fn();
    renderForm({ onSubmit, editView: false });
    fireEvent.change(screen.getByPlaceholderText('Ej: Diseño de Proyecto'), {
      target: { value: 'Mi Misión' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Crear Misión' }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Mi Misión' }),
      false
    );
  });
});

describe('TodoForm — modo edición', () => {
  const task = {
    missionId: 'abc',
    title: 'Misión Existente',
    subtitle: '',
    description: '',
    status: 'in-progress',
    isCompleted: false,
    typeofMission: 'main',
    dueDate: '',
    objectives: [],
  };

  it('muestra el título "Editar Misión"', () => {
    renderForm({ editView: true, task });
    expect(screen.getByRole('heading', { name: 'Editar Misión' })).toBeInTheDocument();
  });

  it('pre-popula el campo de título con el valor del task', () => {
    renderForm({ editView: true, task });
    expect(screen.getByDisplayValue('Misión Existente')).toBeInTheDocument();
  });

  it('llama onSubmit con editView=true al guardar', () => {
    const onSubmit = jest.fn();
    renderForm({ editView: true, task, onSubmit });
    fireEvent.click(screen.getByRole('button', { name: 'Editar Misión' }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ missionId: 'abc', title: 'Misión Existente' }),
      true
    );
  });
});
