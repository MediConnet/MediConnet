import type { Appointment, CreateAppointmentParams } from '../domain/Appointment.entity';
import {
  getAppointmentsAPI,
  createAppointmentAPI,
  deleteAppointmentAPI,
} from './appointment.api';

/**
 * Repository: Abstracción de acceso a datos de citas
 */
export class AppointmentRepository {
  async getAppointments(): Promise<Appointment[]> {
    return await getAppointmentsAPI();
  }

  async createAppointment(params: CreateAppointmentParams): Promise<Appointment> {
    return await createAppointmentAPI(params);
  }

  async deleteAppointment(appointmentId: string): Promise<void> {
    return await deleteAppointmentAPI(appointmentId);
  }
}

