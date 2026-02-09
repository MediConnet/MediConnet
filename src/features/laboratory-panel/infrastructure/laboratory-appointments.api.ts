/**
 * Interfaz de cita de laboratorio
 */
export interface LaboratoryAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string; // Tipo de examen
  notes?: string;
  status?: 'pending' | 'completed' | 'finalizada' | 'cancelled';
}

/**
 * API: Obtener citas del laboratorio
 * Endpoint: GET /api/laboratories/appointments (NO EXISTE AÚN)
 * 
 * TODO: Descomentar cuando backend implemente este endpoint
 */
/*
export const getLaboratoryAppointmentsAPI = async (): Promise<LaboratoryAppointment[]> => {
  const response = await httpClient.get<{ success: boolean; data: LaboratoryAppointment[] }>(
    '/laboratories/appointments'
  );
  return extractData(response);
};
*/

/**
 * API: Obtener detalle de una cita específica
 * Endpoint: GET /api/laboratories/appointments/:id (NO EXISTE AÚN)
 * 
 * TODO: Descomentar cuando backend implemente este endpoint
 */
/*
export const getLaboratoryAppointmentByIdAPI = async (appointmentId: string): Promise<LaboratoryAppointment> => {
  const response = await httpClient.get<{ success: boolean; data: LaboratoryAppointment }>(
    `/laboratories/appointments/${appointmentId}`
  );
  return extractData(response);
};
*/

/**
 * API: Actualizar estado de una cita
 * Endpoint: PUT /api/laboratories/appointments/:id/status (NO EXISTE AÚN)
 * 
 * TODO: Descomentar cuando backend implemente este endpoint
 */
/*
export const updateLaboratoryAppointmentStatusAPI = async (
  appointmentId: string,
  status: 'pending' | 'completed' | 'finalizada' | 'cancelled'
): Promise<LaboratoryAppointment> => {
  const response = await httpClient.put<{ success: boolean; data: LaboratoryAppointment }>(
    `/laboratories/appointments/${appointmentId}/status`,
    { status }
  );
  return extractData(response);
};
*/

// ============================================================================
// NOTA PARA EL DESARROLLADOR:
// ============================================================================
// Estas funciones están preparadas pero comentadas porque el backend aún no
// tiene implementados los endpoints de citas de laboratorio.
//
// Timeline estimado del backend: 1-2 semanas
//
// Cuando el backend implemente los endpoints:
// 1. Descomentar las funciones de arriba
// 2. Actualizar AppointmentsSection.tsx para usar estas APIs
// 3. Actualizar DashboardContent.tsx para usar estas APIs
// 4. Eliminar código de mocks
// ============================================================================
