import { useMutation } from '@tanstack/react-query';
import { sendResetPasswordUseCase } from '../../application/send-reset-password.usecase';
import type { ResetPasswordRequest, ResetPasswordResponse } from '../../domain/ResetPasswordRequest.entity';

/**
 * Hook: Enviar enlace de restablecimiento de contraseña
 */
export const useSendResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: sendResetPasswordUseCase,
  });
};

