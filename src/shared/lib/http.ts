// NOTE: Cliente HTTP configurado con Axios e interceptors
// Configurado para trabajar con el backend serverless de AWS

import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../../app/config/env';
import { useAuthStore } from '../../app/store/auth.store';
import { logger } from './logger';

// ⭐ Sistema de loading global (singleton)
let globalLoadingCount = 0;
const loadingListeners = new Set<() => void>();

const notifyLoadingListeners = () => {
  loadingListeners.forEach((listener) => listener());
};

export const loadingManager = {
  start: () => {
    globalLoadingCount++;
    notifyLoadingListeners();
  },
  stop: () => {
    globalLoadingCount = Math.max(0, globalLoadingCount - 1);
    notifyLoadingListeners();
  },
  subscribe: (listener: () => void) => {
    loadingListeners.add(listener);
    return () => {
      loadingListeners.delete(listener);
    };
  },
  getCount: () => globalLoadingCount,
};

/**
 * Cliente HTTP configurado con interceptors.
 */
// Log para verificar la URL que se está usando (solo en desarrollo)
logger.log('🔌 [HTTP] API URL configurada:', env.API_URL);
logger.log('🔌 [HTTP] VITE_API_URL desde env:', import.meta.env.VITE_API_URL);
logger.log('🔌 [HTTP] MODE:', import.meta.env.MODE);
logger.log('🔌 [HTTP] Verificación - URL termina en /api:', env.API_URL.endsWith('/api'));

// Validación crítica: La URL DEBE terminar en /api
if (!env.API_URL.endsWith('/api')) {
  logger.error('❌ [HTTP] ERROR CRÍTICO: API_URL no termina en /api:', env.API_URL);
  logger.error('❌ [HTTP] Esto causará errores 404. Corrigiendo automáticamente...');
}

// Asegurar que baseURL siempre termine en /api
const baseURL = env.API_URL.endsWith('/api') 
  ? env.API_URL 
  : `${env.API_URL.replace(/\/$/, '')}/api`;

logger.log('🔌 [HTTP] baseURL final para axios:', baseURL);

export const httpClient: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, 
});

// ---------------------------------------------------------------------------
// 1. INTERCEPTOR DE REQUEST (Agrega el Token y activa Loading)
// ---------------------------------------------------------------------------
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token = useAuthStore.getState().token;
    
    // Fallback: Si no hay token en el store (raro), intentar leer de localStorage
    // (Esto es solo por compatibilidad si el store no se ha hidratado aún)
    if (!token) {
      token = 
        localStorage.getItem('accessToken') || 
        localStorage.getItem('auth-token') || 
        localStorage.getItem('token');
    }
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // ⭐ Activar loading para requests que toman tiempo (excluir requests rápidos como /auth/me)
    const isQuickRequest = config.url?.includes('/auth/me') || config.url?.includes('/health');
    if (!isQuickRequest) {
      loadingManager.start();
    }
    
    return config;
  },
  (error: AxiosError) => {
    // ⭐ Desactivar loading en caso de error en el request
    loadingManager.stop();
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// 2. INTERCEPTOR DE RESPONSE (Manejo de Errores y desactivar Loading)
// ---------------------------------------------------------------------------
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // ⭐ Desactivar loading en respuesta exitosa
    const isQuickRequest = response.config.url?.includes('/auth/me') || response.config.url?.includes('/health');
    if (!isQuickRequest) {
      loadingManager.stop();
    }
    return response;
  },
  (error: AxiosError<{ success?: boolean; message?: string; errors?: any }>) => {
    // ⭐ Desactivar loading en caso de error
    const isQuickRequest = error.config?.url?.includes('/auth/me') || error.config?.url?.includes('/health');
    if (!isQuickRequest) {
      loadingManager.stop();
    }
    
    const status = error.response?.status;
    const data = error.response?.data;

    // A. Manejo de Sesión Expirada (401)
    if (status === 401) {
      logger.warn('⚠️ Sesión expirada o token inválido. Cerrando sesión...');
      
      useAuthStore.getState().logout();
      
      // Nota: El store ya se encarga de limpiar el localStorage, 
      // así que no necesitamos repetir los removeItem aquí.
    }

    // B. Manejo de Acceso Denegado (403)
    if (status === 403) {
      logger.warn('⛔ Acceso denegado: No tienes permisos para esta acción');
    }

    // C. Retornar el mensaje de error del backend si existe
    if (data?.message) {
      // Creamos un error limpio con el mensaje del backend
      const customError = new Error(data.message);
      // @ts-ignore: Adjuntamos el código para que la UI pueda leerlo
      customError.code = data.errors?.code || 'API_ERROR';
      return Promise.reject(customError);
    }

    // Error genérico de red o servidor
    return Promise.reject(error);
  }
);

/**
 * Helper para extraer datos de respuestas del backend
 * El backend retorna: { success: true, data: ... }
 */
export const extractData = <T>(response: AxiosResponse<{ success: boolean; data: T; message?: string }>): T => {
  // Caso ideal: Backend responde con success: true y data
  if (response.data?.success && response.data?.data !== undefined) {
    return response.data.data;
  }
  
  // Caso borde: Backend responde directo la data (a veces pasa en proxies)
  // o el campo data es null pero success es true
  if (response.data?.success) {
      // @ts-ignore: Manejo flexible
      return response.data.data ?? (response.data as unknown as T);
  }

  // Si llegamos aquí, la respuesta no tiene el formato esperado
  // Retornamos la data completa como fallback para evitar pantallas blancas
  return response.data as unknown as T;
};