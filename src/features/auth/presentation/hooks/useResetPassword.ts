import { useMutation } from '@tanstack/react-query';
import { resetPasswordUseCase } from '../../application/reset-password.usecase';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordUseCase,
    onSuccess: () => {
      console.log('✅ Contraseña actualizada exitosamente');
    },
    onError: (error: any) => {
      console.error('❌ Error al actualizar contraseña:', error);
    },
  });
};
