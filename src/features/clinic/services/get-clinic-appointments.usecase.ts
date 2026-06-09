import type { AppointmentStatus } from '../types/appointment.entity';
import type { PaginatedResponse } from '../../../shared/types/pagination';
import type { ClinicAppointment } from '../types/appointment.entity';
import { getClinicAppointmentsAPI } from '../api/clinic-appointments.api';

export const getClinicAppointmentsUseCase = async (
  _clinicId: string,
  params?: { page?: number; limit?: number; date?: string; doctorId?: string; status?: AppointmentStatus }
): Promise<PaginatedResponse<ClinicAppointment>> => {
  return await getClinicAppointmentsAPI(params);
};
