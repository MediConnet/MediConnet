import { useMutation } from '@tanstack/react-query';
import { registerProfessionalUseCase } from '../../application/register-professional.usecase';
import type { ProfessionalRequest } from '../../domain/ProfessionalRequest.entity';
import { logger } from '../../../../shared/lib/logger';

export const useRegisterProfessional = () => {
  const mutation = useMutation<void, Error, ProfessionalRequest>({
    mutationFn: async (data) => {
      await registerProfessionalUseCase(data);
    },
    onError: (error) => {
      logger.error("Error en el hook de registro:", error);
    },
  });

  return {
    submit: mutation.mutateAsync, 
    loading: mutation.isPending, 
    error: mutation.error,
    isSuccess: mutation.isSuccess
  };
};