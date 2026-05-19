import { apiClient } from './apiClient';

export const todosService = {
	async getTodos() {
		const { data } = await apiClient.get('/todos');
		return data;
	},
	async createTodo(todo) {
		const { missionId, title, subtitle, description, status, typeofMission, dueDate, objectives } = todo;
		const { data } = await apiClient.post('/todos', {
			missionId, title, subtitle, description, status, typeofMission, dueDate, objectives,
		});
		return data;
	},
	async updateTodo(todo) {
		const { missionId, title, subtitle, description, status, typeofMission, dueDate, objectives } = todo;
		const { data } = await apiClient.patch(`/todos/${missionId}`, {
			title, subtitle, description, status, typeofMission, dueDate, objectives,
		});
		return data;
	},
	async deleteTodo(missionId) {
		await apiClient.delete(`/todos/${missionId}`);
	},
	async migrateTodos(todos) {
		const { data } = await apiClient.post('/todos/migrate', { todos });
		return data;
	},
};
