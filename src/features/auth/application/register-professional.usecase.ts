import { extractData, httpClient } from '../../../shared/lib/http';
import type { ProfessionalRequest } from '../domain/ProfessionalRequest.entity';

/**
 * Caso de uso: Registrar solicitud de profesional
 */
export const registerProfessionalUseCase = async (
  data: ProfessionalRequest
): Promise<{ success: boolean; message: string }> => {
  
  const { files, ...cleanData } = data;

  const response = await httpClient.post<{
    success: boolean;
    data: { message?: string } | null;
    message?: string;
  }>('/auth/register', cleanData);

  // 3. Extracción del mensaje
  const extracted = extractData(response);
  
  const message =
    extracted?.message ||                 
    response.data?.data?.message ||       
    response.data?.message ||             
    'Tu solicitud ha sido enviada. Te contactaremos pronto.';

  return { success: true, message };
};