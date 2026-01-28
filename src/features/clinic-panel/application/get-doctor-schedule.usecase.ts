import type { DoctorSchedule } from '../domain/doctor-schedule.entity';
import { getDoctorScheduleAPI } from '../infrastructure/clinic-doctors.api';

export const getDoctorScheduleUseCase = async (doctorId: string): Promise<DoctorSchedule> => {
  return await getDoctorScheduleAPI(doctorId);
};
