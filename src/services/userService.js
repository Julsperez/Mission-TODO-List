import { apiClient } from './apiClient';

export const userService = {
  async getMe() {
    const { data } = await apiClient.get('/users/me');
    return data;
  },

  async updateProfile({ name }) {
    const { data } = await apiClient.patch('/users/me', { name });
    return data;
  },

  async updateSettings(settings) {
    const { data } = await apiClient.patch('/users/me/settings', settings);
    return data;
  },

  async changePassword({ currentPassword, newPassword }) {
    const { data } = await apiClient.post('/users/me/change-password', { currentPassword, newPassword });
    return data;
  },
};
