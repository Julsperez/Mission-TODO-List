import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { TodoContext, TodoProvider } from './index';

const wrapper = ({ children }) => <TodoProvider>{children}</TodoProvider>;

const baseTodo = (overrides = {}) => ({
  missionId: '1',
  title: 'Test Mission',
  status: 'in-progress',
  isCompleted: false,
  objectives: [],
  ...overrides,
});

describe('updateTodo', () => {
  it('añade un todo nuevo cuando el missionId no existe', () => {
    const { result } = renderHook(() => React.useContext(TodoContext), { wrapper });
    act(() => { result.current.updateTodo(baseTodo()); });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Test Mission');
  });

  it('actualiza un todo existente cuando el missionId ya existe', () => {
    const { result } = renderHook(() => React.useContext(TodoContext), { wrapper });
    act(() => { result.current.updateTodo(baseTodo()); });
    act(() => { result.current.updateTodo(baseTodo({ title: 'Updated' })); });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Updated');
  });

  it('normaliza isCompleted = true cuando status es "completed"', () => {
    const { result } = renderHook(() => React.useContext(TodoContext), { wrapper });
    act(() => { result.current.updateTodo(baseTodo({ status: 'completed', isCompleted: false })); });
    expect(result.current.todos[0].isCompleted).toBe(true);
  });

  it('normaliza isCompleted = false cuando status es "in-progress"', () => {
    const { result } = renderHook(() => React.useContext(TodoContext), { wrapper });
    act(() => { result.current.updateTodo(baseTodo({ status: 'completed', isCompleted: true })); });
    act(() => { result.current.updateTodo(baseTodo({ status: 'in-progress', isCompleted: true })); });
    expect(result.current.todos[0].isCompleted).toBe(false);
  });
});

describe('deleteTodo', () => {
  it('elimina el todo con el missionId correcto', () => {
    const { result } = renderHook(() => React.useContext(TodoContext), { wrapper });
    act(() => { result.current.updateTodo(baseTodo({ missionId: '1' })); });
    act(() => { result.current.updateTodo(baseTodo({ missionId: '2', title: 'Other' })); });
    act(() => { result.current.deleteTodo('1'); });
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].missionId).toBe('2');
  });

  it('no modifica otros todos al borrar uno', () => {
    const { result } = renderHook(() => React.useContext(TodoContext), { wrapper });
    act(() => { result.current.updateTodo(baseTodo()); });
    act(() => { result.current.deleteTodo('999'); });
    expect(result.current.todos).toHaveLength(1);
  });
});

describe('toggleObjective', () => {
  const todoWithObjective = baseTodo({
    objectives: [{ objectiveId: 'o1', description: 'Hacer algo', isCompleted: false }],
  });

  it('marca un objetivo como completado', () => {
    const { result } = renderHook(() => React.useContext(TodoContext), { wrapper });
    act(() => { result.current.updateTodo(todoWithObjective); });
    act(() => { result.current.toggleObjective('1', 'o1'); });
    expect(result.current.todos[0].objectives[0].isCompleted).toBe(true);
  });

  it('desmarca un objetivo ya completado', () => {
    const { result } = renderHook(() => React.useContext(TodoContext), { wrapper });
    const completed = baseTodo({ objectives: [{ objectiveId: 'o1', description: 'X', isCompleted: true }] });
    act(() => { result.current.updateTodo(completed); });
    act(() => { result.current.toggleObjective('1', 'o1'); });
    expect(result.current.todos[0].objectives[0].isCompleted).toBe(false);
  });

  it('no modifica otros objetivos al hacer toggle', () => {
    const { result } = renderHook(() => React.useContext(TodoContext), { wrapper });
    const todo = baseTodo({
      objectives: [
        { objectiveId: 'o1', description: 'A', isCompleted: false },
        { objectiveId: 'o2', description: 'B', isCompleted: false },
      ],
    });
    act(() => { result.current.updateTodo(todo); });
    act(() => { result.current.toggleObjective('1', 'o1'); });
    expect(result.current.todos[0].objectives[1].isCompleted).toBe(false);
  });
});
