import type { ProfessionalRequest } from '../domain/ProfessionalRequest.entity';

/**
 * Caso de uso: Registrar solicitud de profesional
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 */
export const registerProfessionalUseCase = async (
  data: ProfessionalRequest
): Promise<{ success: boolean; message: string }> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.post('/auth/register-professional', data);
  // return response.data;

  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // NOTE: Simulación - en producción esto guardaría la solicitud
  console.log('Solicitud de registro profesional:', data);

  return {
    success: true,
    message: 'Tu solicitud ha sido enviada. Te contactaremos pronto.',
  };
};

