import type { Appointment } from '../domain/Appointment.entity';
import { AppointmentRepository } from '../infrastructure/appointment.repository';

const appointmentRepository = new AppointmentRepository();

/**
 * Caso de uso: Obtener lista de citas del usuario
 */
export const getAppointmentsUseCase = async (): Promise<Appointment[]> => {
  return await appointmentRepository.getAppointments();
};

