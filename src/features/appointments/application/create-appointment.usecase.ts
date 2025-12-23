import type { Appointment, CreateAppointmentParams } from '../domain/Appointment.entity';
import { AppointmentRepository } from '../infrastructure/appointment.repository';

const appointmentRepository = new AppointmentRepository();

/**
 * Caso de uso: Crear una nueva cita
 */
export const createAppointmentUseCase = async (
  params: CreateAppointmentParams
): Promise<Appointment> => {
  return await appointmentRepository.createAppointment(params);
};

