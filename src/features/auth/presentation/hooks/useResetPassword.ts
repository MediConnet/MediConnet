import { useMutation } from '@tanstack/react-query';
import { resetPasswordUseCase } from '../../application/reset-password.usecase';
import { useFeedbackStore } from '../../../../app/store/feedback.store';

export const useResetPassword = () => {
  const feedback = useFeedbackStore();

  return useMutation({
    mutationFn: resetPasswordUseCase,
    onSuccess: () => {
      feedback.showFeedback('success', 'Contraseña actualizada', 'Tu contraseña se ha actualizado correctamente.');
    },
    onError: () => {
      feedback.showFeedback('error', 'Error', 'No fue posible actualizar la contraseña.');
    },
  });
};
