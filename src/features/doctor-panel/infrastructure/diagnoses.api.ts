import { httpClient } from "../../../shared/lib/http";

export interface DiagnosisParams {
  title: string;
  description: string;
  prescription?: string;
  notes?: string;
}

// Interfaz de respuesta del diagnóstico (si la necesitas para tipar el retorno)
export interface Diagnosis {
  id: string;
  appointment_id: string;
  title: string;
  description: string;
  prescription: string | null;
  created_at: string;
}

/**
 * Crea un diagnóstico para una cita específica
 * Endpoint: POST /api/doctors/appointments/:id/diagnosis
 */
export const createDiagnosisAPI = async (
  appointmentId: string,
  data: DiagnosisParams
): Promise<boolean> => {
  const response = await httpClient.post<{ success: boolean; data: any }>(
    `/doctors/appointments/${appointmentId}/diagnosis`,
    data
  );
  
  // Retornamos true si la operación fue exitosa
  return response.data.success;
};

/**
 * TODO: Obtener diagnóstico por cita
 * Nota: Actualmente tu backend no tiene un endpoint específico GET para esto,
 * o el endpoint de appointments no está devolviendo el diagnóstico incluido.
 * * Por ahora dejaremos esta función preparada para cuando actualices el backend.
 */
export const getDiagnosisByAppointmentAPI = async (appointmentId: string): Promise<Diagnosis | null> => {
  try {
    // Ejemplo de cómo sería la llamada si existiera el endpoint
    // const response = await httpClient.get<{ success: boolean; data: Diagnosis }>(
    //   `/doctors/appointments/${appointmentId}/diagnosis`
    // );
    // return extractData(response);
    return null;
  } catch (error) {
    return null;
  }
};