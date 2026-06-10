// NOTE: Cliente HTTP configurado con Axios e interceptors
// Configurado para trabajar con el backend serverless de AWS

import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { env } from '../../app/config/env';
import { useAuthStore } from '../../app/store/auth.store';
import { getUserFriendlyMessage, logApiError, USER_MESSAGES } from './api-error';
import { createLogger, logger } from './logger';

const httpLog = createLogger('HTTP');

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
  (error: AxiosError<{ success?: boolean; message?: string; code?: string; errors?: { code?: string } }>) => {
    const isQuickRequest =
      error.config?.url?.includes('/auth/me') || error.config?.url?.includes('/health');
    if (!isQuickRequest) {
      loadingManager.stop();
    }

    const url = error.config?.url ?? 'unknown';
    logApiError('HTTP', error, { url, method: error.config?.method });

    const status = error.response?.status;
    const backendCode = error.response?.data?.code ?? error.response?.data?.errors?.code;
    const backendMessage = error.response?.data?.message;

    // No cerrar sesión en el endpoint de login — el usuario no está autenticado
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/change-password') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password');
    if (status === 401 && !isAuthEndpoint) {
      httpLog.warn('Sesión expirada o token inválido — cerrando sesión');
      useAuthStore.getState().logout();
    }

    if (status === 403) {
      httpLog.warn('Acceso denegado', { url });
    }

    // Usar mensaje del backend si tiene un código específico (ej. INVITED_NOT_REGISTERED)
    let userMessage: string;
    if (backendCode) {
      userMessage = backendMessage || USER_MESSAGES.generic;
    } else {
      userMessage = getUserFriendlyMessage(error, { allowBackendMessage: isAuthEndpoint });
    }

    const safeError = new Error(userMessage || USER_MESSAGES.generic);
    Object.assign(safeError, {
      status,
      code: backendCode ?? 'API_ERROR',
      isApiError: true,
    });

    return Promise.reject(safeError);
  }
);

/**
 * Helper para extraer datos de respuestas del backend
 * El backend retorna: { success: true, data: ... }
 */
export const extractData = <T>(
  response: AxiosResponse<{ success: boolean; data: T; message?: string }>,
  context = 'extractData',
): T => {
  if (response.data?.success && response.data?.data !== undefined) {
    return response.data.data;
  }

  if (response.data?.success) {
    return (response.data.data ?? response.data) as unknown as T;
  }

  httpLog.warn('Respuesta sin formato { success, data }', {
    context,
    url: response.config?.url,
    keys: response.data != null ? Object.keys(response.data as object) : [],
  });

  return response.data as unknown as T;
};