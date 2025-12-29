// NOTE: Cliente HTTP configurado con Axios e interceptors
// TODO: Agregar manejo de errores más robusto y retry logic

import axios, { type AxiosInstance, AxiosError } from 'axios';
import { env } from '../../app/config/env';
import { useAuthStore } from '../../app/store/auth.store';

/**
 * Cliente HTTP configurado con interceptors para:
 * - Agregar token de autenticación automáticamente
 * - Manejar errores 401 (no autorizado)
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// NOTE: Interceptor de request - Agrega el token de autenticación a cada petición
httpClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// NOTE: Interceptor de response - Maneja errores de autenticación
// TODO: Agregar manejo de otros códigos de error (403, 500, etc.)
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // NOTE: Token inválido o expirado - redirigir a home
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/home';
    }
    return Promise.reject(error);
  }
);

