import { httpClient } from "../../../shared/lib/http";

export interface DiagnosisParams {
  diagnosis: string;
  treatment: string;
  indications: string;
  observations?: string;
}

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

export const getDiagnosisByAppointmentAPI = async (appointmentId: string): Promise<Diagnosis | null> => {
  try {
    const response = await httpClient.get<{ success: boolean; data: Diagnosis }>(
      `/doctors/appointments/${appointmentId}/diagnosis`
    );
    return response.data.data;
  } catch (error) {
    console.warn("No se encontró diagnóstico previo o error de conexión", error);
    return null;
  }
};
