import type { Appointment, CreateAppointmentParams } from '../domain/Appointment.entity';

const STORAGE_KEY = 'medify_appointments';

/**
 * API: Obtener lista de citas del usuario
 */
export const getAppointmentsAPI = async (): Promise<Appointment[]> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

/**
 * API: Crear una nueva cita
 */
export const createAppointmentAPI = async (
  params: CreateAppointmentParams
): Promise<Appointment> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const appointments = await getAppointmentsAPI();
  const newAppointment: Appointment = {
    id: `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...params,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  appointments.push(newAppointment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));

  return newAppointment;
};

/**
 * API: Eliminar una cita
 */
export const deleteAppointmentAPI = async (appointmentId: string): Promise<void> => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 300));

  const appointments = await getAppointmentsAPI();
  const filtered = appointments.filter((app) => app.id !== appointmentId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

