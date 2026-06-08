import type { AppointmentStatus } from '../types/appointment.entity';
import { updateAppointmentStatusAPI } from '../api/clinic-appointments.api';

export const updateAppointmentStatusUseCase = async (
  _clinicId: string,
  appointmentId: string,
  status: AppointmentStatus
): Promise<void> => {
  await updateAppointmentStatusAPI(appointmentId, status);
};
