import { httpClient, extractData } from '../../../shared/lib/http';
import type { ResetPasswordRequest, ResetPasswordResponse } from '../domain/ResetPasswordRequest.entity';

/**
 * Tipos para autenticación
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    userId: string;
    email: string;
    name: string;
    role: string;
    serviceType?: string;
  };
  token: string; // JWT Access Token
  accessToken?: string; // Por si el backend usa este nombre
  refreshToken?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'PROVIDER' | 'PROFESIONAL' | 'PATIENT';
  serviceType?: 'doctor' | 'pharmacy' | 'laboratory' | 'ambulance' | 'supplies';
}

export interface RegisterResponse {
  userId: string;
  cognitoUserId: string;
  email: string;
  name: string;
  message: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

/**
 * API: Login de usuario
 * Endpoint: POST /api/auth/login
 * El backend retorna: { success: true, data: { user: {...}, token: "..." } }
 */
export const loginAPI = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await httpClient.post<{ 
    success: boolean; 
    data: {
      user: {
        userId: string;
        email: string;
        name: string;
        role: string;
        serviceType?: string;
      };
      token?: string;
      accessToken?: string;
      refreshToken?: string;
    }
  }>(
    '/auth/login',
    credentials
  );
  
  const data = extractData(response);
  
  // Retornar en formato compatible con el código existente
  return {
    user: data.user,
    token: data.token || data.accessToken || '',
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
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
export const getCurrentUserAPI = async (): Promise<LoginResponse> => {
  const response = await httpClient.get<{ success: boolean; data: LoginResponse }>(
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
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await httpClient.post<{ success: boolean; data: { message: string } }>(
    '/auth/reset-password',
    { token, newPassword }
  );
  return extractData(response);
};
