import type { AppointmentStatus } from '../domain/appointment.entity';
import { updateAppointmentStatusAPI } from '../infrastructure/clinic-appointments.api';

export const updateAppointmentStatusUseCase = async (
  _clinicId: string,
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> => {
  await updateAppointmentStatusAPI(appointmentId, status);
};
