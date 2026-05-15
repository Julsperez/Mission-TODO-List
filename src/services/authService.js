import axios from 'axios';
import { tokenService } from './tokenService';

// Instancia limpia sin interceptores — usada solo para el refresh token
// para evitar que un 401 en el refresh dispare otro ciclo de refresh
const authAxios = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});

export const authService = {
  async login(email, password) {
    const { data } = await authAxios.post('/auth/login', { email, password });
    tokenService.setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async register(name, email, password) {
    const { data } = await authAxios.post('/auth/register', { name, email, password });
    return data;
  },

  async logout() {
    try {
      const token = tokenService.getRefresh();
      await authAxios.post('/auth/logout', { refreshToken: token });
    } finally {
      tokenService.clearTokens();
    }
  },

  async refreshToken() {
    const token = tokenService.getRefresh();
    const { data } = await authAxios.post('/auth/refresh', { refreshToken: token });
    return data; // { accessToken, refreshToken }
  },

  async forgotPassword(email) {
    const { data } = await authAxios.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token, newPassword) {
    const { data } = await authAxios.post('/auth/reset-password', { token, newPassword });
    return data;
  },

  async verifyEmail(token) {
    const { data } = await authAxios.post('/auth/verify-email', { token });
    return data;
  },
};
