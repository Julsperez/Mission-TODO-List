import { apiClient } from './apiClient';

export const todosService = {
	async getTodos() {
		const { data } = await apiClient.get('/api/v1/todos');
		return data;
	},
	async createTodo(todo) {
		const { missionId, title, subtitle, description, status, typeofMission, dueDate, objectives } = todo;
    const { data } = await apiClient.post('/api/v1/todos', {
      missionId, title, subtitle, description, status, typeofMission, dueDate, objectives,
    });
		return data;
	},
	async updateTodo(todo) {
		const { missionId, title, subtitle, description, status, typeofMission, dueDate, objectives } = todo;
    const { data } = await apiClient.patch(`/api/v1/todos/${missionId}`, {
      title, subtitle, description, status, typeofMission, dueDate, objectives,
    });
		return data;
	},

	async deleteTodo(missionId) {
		await apiClient.delete(`/api/v1/todos/${missionId}`);
	},

	async migrateTodos(todos) {
		const { data } = await apiClient.post('/api/v1/todos/migrate', { todos });
		return data;
	},
};
