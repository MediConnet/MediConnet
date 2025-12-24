import type { ResetPasswordRequest, ResetPasswordResponse } from '../domain/ResetPasswordRequest.entity';

/**
 * API: Enviar enlace de restablecimiento de contraseña
 * TODO: Conectar con endpoint real del backend cuando esté disponible
 * Endpoint esperado: POST /api/auth/reset-password
 */
export const sendResetPasswordAPI = async (
  request: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  // TODO: Reemplazar con llamada real al backend
  // const response = await httpClient.post<ResetPasswordResponse>('/auth/reset-password', request);
  // return response.data;

  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // NOTE: Simulación - en producción esto enviaría un email real
  // Por ahora, solo validamos que el email tenga formato válido
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(request.email)) {
    return {
      success: false,
      message: 'Por favor ingresa un correo electrónico válido',
    };
  }

  return {
    success: true,
    message: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico',
  };
};

