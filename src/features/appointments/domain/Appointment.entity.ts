/**
 * Entidad Appointment
 * Representa una cita médica del usuario
 */
export interface Appointment {
  id: string;
  title: string;
  date: string; // Formato: YYYY-MM-DD
  time: string; // Formato: HH:mm
  location?: string;
  notes?: string;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentParams {
  title: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
  reminderEnabled: boolean;
}

