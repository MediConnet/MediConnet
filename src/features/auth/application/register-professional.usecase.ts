import { extractData, httpClient } from '../../../shared/lib/http';
import type { ProfessionalRequest } from '../domain/ProfessionalRequest.entity';

/**
 * Caso de uso: Registrar solicitud de profesional
 */
export const registerProfessionalUseCase = async (
  data: ProfessionalRequest
): Promise<{ success: boolean; message: string }> => {
  
  const { files, ...cleanData } = data as ProfessionalRequest & Record<string, unknown>;

  const hasFiles =
    Boolean(files) &&
    (files?.licenses?.length || files?.certificates?.length || files?.titles?.length);

  const response = await (hasFiles
    ? httpClient.post<{
        success: boolean;
        data: { message?: string } | null;
        message?: string;
      }>(
        '/auth/register',
        (() => {
          const formData = new FormData();

          // Adjuntar campos (texto) al FormData
          Object.entries(cleanData).forEach(([key, value]) => {
            if (value === undefined || value === null) return;

            // Arrays (ej: specialties) -> repetir key para que el backend lo trate como lista
            if (Array.isArray(value)) {
              value.forEach((item) => {
                if (item === undefined || item === null) return;
                formData.append(key, String(item));
              });
              return;
            }

            // Objetos -> serializar (por si llega alguno)
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value));
              return;
            }

            formData.append(key, String(value));
          });

          // Adjuntar archivos
          files?.licenses?.forEach((file) => formData.append('licenses', file));
          files?.certificates?.forEach((file) => formData.append('certificates', file));
          files?.titles?.forEach((file) => formData.append('titles', file));

          return formData;
        })(),
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
    : httpClient.post<{
        success: boolean;
        data: { message?: string } | null;
        message?: string;
      }>('/auth/register', cleanData));

  // 3. Extracción del mensaje
  const extracted = extractData(response);
  
  const message =
    extracted?.message ||                 
    response.data?.data?.message ||       
    response.data?.message ||             
    'Tu solicitud ha sido enviada. Te contactaremos pronto.';

  return { success: true, message };
};