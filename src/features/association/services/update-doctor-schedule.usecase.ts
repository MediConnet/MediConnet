import type { DoctorSchedule } from '../types/doctor-schedule.entity';
import { updateDoctorScheduleAPI } from '../api/clinic-doctors.api';

export const updateDoctorScheduleUseCase = async (
  doctorId: string,
  schedule: Partial<DoctorSchedule>
): Promise<DoctorSchedule> => {
  return await updateDoctorScheduleAPI(doctorId, schedule);
};
