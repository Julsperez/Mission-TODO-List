import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TodoContext } from '../../TodoContext';
import { TodoItem } from './TodoItem';

jest.mock('../', () => ({
  OverflowMenu: ({ onSelectedOption }) => (
    <div data-testid="overflow-menu">
      <button onClick={() => onSelectedOption('complete')}>complete</button>
      <button onClick={() => onSelectedOption('archive')}>archive</button>
      <button onClick={() => onSelectedOption('active')}>active</button>
      <button onClick={() => onSelectedOption('delete')}>delete</button>
    </div>
  ),
}));

const mockCtx = {
  setOpenTaskModal: jest.fn(),
  setIsShowTaskInfo: jest.fn(),
  setTask: jest.fn(),
};

const baseTodo = (overrides = {}) => ({
  missionId: '1',
  title: 'Test Mission',
  subtitle: 'Sub',
  status: 'in-progress',
  isCompleted: false,
  typeofMission: 'main',
  objectives: [],
  ...overrides,
});

const renderItem = (todo, onItemUpdated = jest.fn()) =>
  render(
    <TodoContext.Provider value={mockCtx}>
      <TodoItem todo={todo} onItemUpdated={onItemUpdated} />
    </TodoContext.Provider>
  );

describe('TodoItem — acciones del menú contextual', () => {
  it('complete: onItemUpdated recibe status "completed"', () => {
    const onItemUpdated = jest.fn();
    renderItem(baseTodo(), onItemUpdated);
    fireEvent.click(screen.getByText('complete'));
    expect(onItemUpdated).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'completed' })
    );
  });

  it('complete: no actúa si la tarea ya está completada', () => {
    const onItemUpdated = jest.fn();
    renderItem(baseTodo({ isCompleted: true }), onItemUpdated);
    fireEvent.click(screen.getByText('complete'));
    expect(onItemUpdated).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'in-progress' })
    );
  });

  it('archive: onItemUpdated recibe status "archived"', () => {
    const onItemUpdated = jest.fn();
    renderItem(baseTodo(), onItemUpdated);
    fireEvent.click(screen.getByText('archive'));
    expect(onItemUpdated).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'archived' })
    );
  });

  it('active (reactivar): onItemUpdated recibe status "in-progress"', () => {
    const onItemUpdated = jest.fn();
    renderItem(baseTodo({ status: 'completed', isCompleted: true }), onItemUpdated);
    fireEvent.click(screen.getByText('active'));
    expect(onItemUpdated).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'in-progress' })
    );
  });

  it('delete: onItemUpdated recibe status "deleted"', () => {
    const onItemUpdated = jest.fn();
    renderItem(baseTodo(), onItemUpdated);
    fireEvent.click(screen.getByText('delete'));
    expect(onItemUpdated).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'deleted' })
    );
  });
});

describe('TodoItem — indicador de vencimiento', () => {
  it('muestra badge "Vencida" si la fecha ya pasó y no está completada', () => {
    renderItem(baseTodo({ dueDate: '2020-01-01' }));
    expect(screen.getByText('Vencida')).toBeInTheDocument();
  });

  it('no muestra badge si la tarea está completada aunque esté vencida', () => {
    renderItem(baseTodo({ dueDate: '2020-01-01', isCompleted: true }));
    expect(screen.queryByText('Vencida')).not.toBeInTheDocument();
  });

  it('no muestra badge si no hay dueDate', () => {
    renderItem(baseTodo());
    expect(screen.queryByText('Vencida')).not.toBeInTheDocument();
  });
});

describe('TodoItem — contador de objetivos', () => {
  it('no muestra contador si no hay objetivos', () => {
    renderItem(baseTodo());
    expect(screen.queryByText(/objetivos/)).not.toBeInTheDocument();
  });

  it('muestra "X de Y objetivos" correctamente', () => {
    const todo = baseTodo({
      objectives: [
        { objectiveId: 'o1', isCompleted: true },
        { objectiveId: 'o2', isCompleted: false },
      ],
    });
    renderItem(todo);
    expect(screen.getByText('1 de 2 objetivos')).toBeInTheDocument();
  });
});
