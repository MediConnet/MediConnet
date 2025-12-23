import { AppointmentRepository } from '../infrastructure/appointment.repository';

const appointmentRepository = new AppointmentRepository();

/**
 * Caso de uso: Eliminar una cita
 */
export const deleteAppointmentUseCase = async (appointmentId: string): Promise<void> => {
  return await appointmentRepository.deleteAppointment(appointmentId);
};

