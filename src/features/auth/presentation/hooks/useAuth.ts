import { useMutation } from '@tanstack/react-query';
import { sendResetPasswordUseCase } from '../../application/send-reset-password.usecase';
import type { ResetPasswordRequest } from '../../domain/ResetPasswordRequest.entity';

/**
 * Hook: Enviar enlace de restablecimiento de contraseña
 */
export const useSendResetPassword = () => {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) => sendResetPasswordUseCase(request),
    onError: (error) => {
      console.error('Error en useSendResetPassword:', error);
    },
  });
};

