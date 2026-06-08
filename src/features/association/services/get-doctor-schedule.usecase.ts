import type { DoctorSchedule } from '../types/doctor-schedule.entity';
import { getDoctorScheduleAPI } from '../api/clinic-doctors.api';

export const getDoctorScheduleUseCase = async (doctorId: string): Promise<DoctorSchedule> => {
  return await getDoctorScheduleAPI(doctorId);
};
