import { apiClient } from './apiClient';

export const settingsService = {
  async updateSettings(settings) {
    const { data } = await apiClient.patch('/users/me/settings', settings);
    return data;
  },
};
