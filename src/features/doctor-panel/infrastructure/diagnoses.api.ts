import { httpClient } from "../../../shared/lib/http";

export interface DiagnosisParams {
  diagnosis: string;    // Título (Ej: Faringitis Aguda)
  treatment: string;    // Medicamentos / Receta
  indications: string;  // Indicaciones / Cuidados
  observations?: string; // Notas opcionales
}

// Interfaz de respuesta (Lo que devuelve la BD - medical_history)
export interface Diagnosis {
  id: string;
  patient_id: string;
  provider_id: string;
  appointment_id?: string;
  diagnosis: string;
  treatment: string | null;
  indications: string | null;
  observations: string | null;
  date: string;
  created_at: string;
}

/**
 * Crea o Actualiza un diagnóstico para una cita específica
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
  return response.data.success;
};

/**
 * Obtener diagnóstico por cita
 * Endpoint: GET /api/doctors/appointments/:id/diagnosis
 * Retorna el objeto Diagnosis si existe, o null si no existe (404).
 */
export const getDiagnosisByAppointmentAPI = async (appointmentId: string): Promise<Diagnosis | null> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: Diagnosis }>(
      `/doctors/appointments/${appointmentId}/diagnosis`
    );
    return response.data.data;
  } catch (error) {
    // Si da error (ej: 404 Not Found porque aún no se ha creado), 
    // retornamos null para que el frontend sepa que debe mostrar el formulario vacío.
    console.warn("No se encontró diagnóstico previo o error de conexión", error);
    return null;
  }
};