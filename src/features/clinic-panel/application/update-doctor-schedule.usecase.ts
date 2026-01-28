import type { DoctorSchedule } from '../domain/doctor-schedule.entity';
import { updateDoctorScheduleAPI } from '../infrastructure/clinic-doctors.api';

export const updateDoctorScheduleUseCase = async (
  doctorId: string,
  schedule: Partial<DoctorSchedule>
): Promise<DoctorSchedule> => {
  return await updateDoctorScheduleAPI(doctorId, schedule);
};
