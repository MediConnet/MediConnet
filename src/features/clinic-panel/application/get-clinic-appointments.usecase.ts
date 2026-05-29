import type { AppointmentStatus } from '../domain/appointment.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicAppointment } from '../domain/appointment.entity';
import { getClinicAppointmentsAPI } from '../infrastructure/clinic-appointments.api';

export const getClinicAppointmentsUseCase = async (
  _clinicId: string,
  params?: { page?: number; limit?: number; date?: string; doctorId?: string; status?: AppointmentStatus }
): Promise<PaginatedResponse<ClinicAppointment>> => {
  return await getClinicAppointmentsAPI(params);
};
