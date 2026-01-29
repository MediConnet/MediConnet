import { extractData, httpClient } from '../../../shared/lib/http';
import type { ResetPasswordRequest, ResetPasswordResponse } from '../domain/ResetPasswordRequest.entity';

/**
 * 1. Definición robusta del Usuario
 * Coincide con lo que el backend envía en el login y en /me
 */
export interface User {
  id: string;
  userId: string; // Compatibilidad
  email: string;
  name?: string;  // Puede venir del provider
  role: string;
  serviceType?: string; // Para lógica de redirección y UI
  tipo?: string; // ⚠️ CRÍTICO: Para guards de rutas
  profilePictureUrl?: string | null;
  isActive?: boolean;
  provider?: {
    id: string;
    commercialName: string;
    logoUrl?: string | null;
  };
}

/**
 * Tipos para autenticación
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;         // JWT Access Token (campo de compatibilidad)
  accessToken: string;   // Nombre estándar
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'PROVIDER' | 'PROFESIONAL' | 'PATIENT';
  serviceType?: string;
  // Permitir propiedades extra para los datos del profesional (address, city, etc.)
  [key: string]: any; 
}

export interface RegisterResponse {
  userId: string;
  email: string;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user?: User; 
}

/**
 * API: Login de usuario
 * Endpoint: POST /api/auth/login
 */
export const loginAPI = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await httpClient.post<{ success: boolean; data: LoginResponse }>(
    '/auth/login',
    credentials
  );
  
  const data = extractData(response);
  
  // Normalización para asegurar que siempre haya un token usable
  return {
    ...data,
    token: data.token || data.accessToken || '',
  };
};

/**
 * API: Registro de usuario
 * Endpoint: POST /api/auth/register
 */
export const registerAPI = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await httpClient.post<{ success: boolean; data: RegisterResponse }>(
    '/auth/register',
    data
  );
  return extractData(response);
};

/**
 * API: Obtener información del usuario actual
 * Endpoint: GET /api/auth/me
 */
export const getCurrentUserAPI = async (): Promise<User> => {
  const response = await httpClient.get<{ success: boolean; data: User }>(
    '/auth/me'
  );
  return extractData(response);
};

/**
 * API: Refrescar token
 * Endpoint: POST /api/auth/refresh
 */
export const refreshTokenAPI = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  const response = await httpClient.post<{ success: boolean; data: RefreshTokenResponse }>(
    '/auth/refresh',
    { refreshToken }
  );
  return extractData(response);
};

/**
 * API: Cerrar Sesión (Logout)
 * Endpoint: POST /api/auth/logout
 */
export const logoutAPI = async (): Promise<{ message: string }> => {
  const response = await httpClient.post<{ success: boolean; data: { message: string } }>(
    '/auth/logout',
    {}
  );
  return extractData(response);
};

/**
 * API: Enviar enlace de restablecimiento de contraseña
 * Endpoint: POST /api/auth/forgot-password
 */
export const sendResetPasswordAPI = async (
  request: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const response = await httpClient.post<{ success: boolean; data: ResetPasswordResponse }>(
    '/auth/forgot-password',
    request
  );
  return extractData(response);
};

/**
 * API: Resetear contraseña
 * Endpoint: POST /api/auth/reset-password
 */
export const resetPasswordAPI = async (
  token: string,      
  newPassword: string,
  email: string       
): Promise<{ message: string }> => { 
  
  const response = await httpClient.post<{ success: boolean; data: { message: string } }>(
    '/auth/reset-password',
    { 
      code: token, 
      newPassword, 
      email: email 
    }
  );

  return extractData(response);
};