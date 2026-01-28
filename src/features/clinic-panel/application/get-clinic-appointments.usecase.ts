import type { ClinicAppointment, AppointmentStatus } from '../domain/appointment.entity';
import { getClinicAppointmentsAPI } from '../infrastructure/clinic-appointments.api';

export const getClinicAppointmentsUseCase = async (
  clinicId: string,
  date?: string,
  doctorId?: string,
  status?: AppointmentStatus
): Promise<ClinicAppointment[]> => {
  return await getClinicAppointmentsAPI(date, doctorId, status);
};
