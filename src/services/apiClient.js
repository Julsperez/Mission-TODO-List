import axios from 'axios';
import { tokenService } from './tokenService';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
}

apiClient.interceptors.request.use((config) => {
  const token = tokenService.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error('Sin conexión. Verifica tu red e intenta de nuevo.')
      );
    }

    const originalRequest = error.config;

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // El refresh también falló — limpiar sesión y redirigir
    if (originalRequest._retry) {
      tokenService.clearTokens();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Encolar si ya hay un refresh en curso
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Importación dinámica para evitar dependencia circular en el módulo
      const { authService } = await import('./authService');
      const { accessToken, refreshToken } = await authService.refreshToken();

      tokenService.setTokens(accessToken, refreshToken);
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenService.clearTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export { apiClient };
