import type { ResetPasswordRequest, ResetPasswordResponse } from '../domain/ResetPasswordRequest.entity';
import { AuthRepository } from '../infrastructure/auth.repository';

const authRepository = new AuthRepository();

/**
 * Caso de uso: Enviar enlace de restablecimiento de contraseña
 */
export const sendResetPasswordUseCase = async (
  request: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  return await authRepository.sendResetPassword(request);
};

