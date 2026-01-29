import type { ResetPasswordRequest, ResetPasswordResponse } from '../domain/ResetPasswordRequest.entity';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from './auth.api';
import {
  getCurrentUserAPI,
  loginAPI,
  logoutAPI,
  refreshTokenAPI,
  registerAPI,
  resetPasswordAPI,
  sendResetPasswordAPI,
} from './auth.api';

/**
 * Repository: Abstracción de acceso a datos de autenticación.
 * * Su función es desacoplar la API del resto de la aplicación.
 */
export class AuthRepository {
  /**
   * Iniciar sesión
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    return await loginAPI(request);
  }

  /**
   * Registrar nuevo usuario
   */
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    return await registerAPI(request);
  }

  /**
   * Obtener usuario actual (basado en token)
   */
  async getCurrentUser(): Promise<User> {
    return await getCurrentUserAPI();
  }

  /**
   * Refrescar el token de acceso
   */
  async refreshToken(token: string): Promise<RefreshTokenResponse> {
    return await refreshTokenAPI(token);
  }

  /**
   * Cerrar sesión en el servidor
   */
  async logout(): Promise<{ message: string }> {
    return await logoutAPI();
  }

  /**
   * Solicitar correo de recuperación de contraseña
   */
  async sendResetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return await sendResetPasswordAPI(request);
  }

  /**
   * Establecer nueva contraseña usando el código (token)
   */
  async resetPassword(token: string, newPassword: string, email: string): Promise<{ message: string }> {
    return await resetPasswordAPI(token, newPassword, email);
  }
}