import type { ProfessionalRequest } from '../domain/ProfessionalRequest.entity';
import { httpClient, extractData } from '../../../shared/lib/http';

/**
 * Caso de uso: Registrar solicitud de profesional
 */
export const registerProfessionalUseCase = async (
  data: ProfessionalRequest
): Promise<{ success: boolean; message: string }> => {
  const response = await httpClient.post<{
    success: boolean;
    data: { message?: string } | null;
    message?: string;
  }>('/auth/register-professional', data);

  // Preferir message dentro de data; fallback a message raíz
  const extracted = extractData(response);
  const message =
    extracted?.message ||
    response.data?.message ||
    'Tu solicitud ha sido enviada. Te contactaremos pronto.';

  return { success: true, message };
};

