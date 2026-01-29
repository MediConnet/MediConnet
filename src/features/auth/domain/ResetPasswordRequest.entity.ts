/**
 * Entidad ResetPasswordRequest
 * Representa una solicitud de restablecimiento de contraseña
 */
export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message: string;
}