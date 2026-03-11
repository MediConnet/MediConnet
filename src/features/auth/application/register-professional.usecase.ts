import { extractData, httpClient } from '../../../shared/lib/http';
import type { ProfessionalRequest } from '../domain/ProfessionalRequest.entity';

/**
 * Caso de uso: Registrar solicitud de profesional
 */
export const registerProfessionalUseCase = async (
  data: ProfessionalRequest
): Promise<{ success: boolean; message: string }> => {
  
  const { files, ...cleanData } = data as ProfessionalRequest & Record<string, unknown>;

  // 🔍 DEBUG: Ver datos antes de procesar
  console.log('🔍 cleanData completo:', cleanData);
  console.log('📧 cleanData.email:', cleanData.email);

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

          // 🔍 DEBUG: Ver email en FormData
          console.log('📧 Email en FormData:', formData.get('email'));

          return formData;
        })(),
        {
          // Importante: al enviar FormData, no usar application/json.
          // Axios en browser maneja boundary automáticamente cuando el Content-Type es multipart/form-data.
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
    : (() => {
        // 🔍 DEBUG: Ver datos JSON antes de enviar
        console.log('📤 Enviando JSON (sin archivos):', cleanData);
        return httpClient.post<{
          success: boolean;
          data: { message?: string } | null;
          message?: string;
        }>('/auth/register', cleanData);
      })());

  // 3. Extracción del mensaje
  const extracted = extractData(response);
  
  const message =
    extracted?.message ||                 
    response.data?.data?.message ||       
    response.data?.message ||             
    'Tu solicitud ha sido enviada. Te contactaremos pronto.';

  return { success: true, message };
};