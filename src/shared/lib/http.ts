// NOTE: Cliente HTTP configurado con Axios e interceptors
// Configurado para trabajar con el backend serverless de AWS

import axios, { type AxiosInstance, AxiosError, type AxiosResponse } from 'axios';
import { env } from '../../app/config/env';
import { useAuthStore } from '../../app/store/auth.store';

/**
 * Cliente HTTP configurado con interceptors para:
 * - Agregar token de autenticación automáticamente (JWT de Cognito)
 * - Manejar errores de autenticación (401, 403)
 * - Extraer datos de respuestas del backend (formato: { success, data, message })
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
});

// Interceptor de request - Agrega el token de autenticación a cada petición
httpClient.interceptors.request.use(
  (config) => {
    // Buscar token en múltiples lugares (prioridad: store > accessToken > auth-token > token)
    const authStore = useAuthStore();
    let token = authStore.getState().token;
    
    // Si no hay token en el store, intentar leer de localStorage directamente
    if (!token) {
      token = 
        localStorage.getItem('accessToken') || 
        localStorage.getItem('auth-token') || 
        localStorage.getItem('token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - Maneja errores y extrae datos de respuestas
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // El backend retorna { success: true, data: ... } o { success: false, message: ... }
    // Extraemos directamente la respuesta para mantener compatibilidad
    return response;
  },
  (error: AxiosError<{ success?: boolean; message?: string; errors?: any }>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // Manejo de errores de autenticación
    if (status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      // Limpiar todos los tokens de localStorage
      localStorage.removeItem('auth-token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      // No redirigir automáticamente, dejar que cada componente maneje el logout
      console.warn('Sesión expirada o no autorizado');
    }

    // Manejo de errores de autorización
    if (status === 403) {
      console.warn('Acceso denegado');
    }

    // Retornar error con mensaje del backend si está disponible
    if (data?.message) {
      return Promise.reject(new Error(data.message));
    }

    // Error genérico
    return Promise.reject(error);
  }
);

/**
 * Helper para extraer datos de respuestas del backend
 * El backend retorna: { success: true, data: ... }
 */
export const extractData = <T>(response: AxiosResponse<{ success: boolean; data: T }>): T => {
  if (response.data.success && response.data.data) {
    return response.data.data;
  }
  throw new Error('Invalid response format from backend');
};
