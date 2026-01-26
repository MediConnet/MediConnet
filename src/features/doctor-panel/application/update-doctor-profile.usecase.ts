import type { DoctorDashboard } from "../domain/DoctorDashboard.entity";
import {
  updateDoctorProfileAPI,
  updateDoctorScheduleAPI,
  type UpdateDoctorProfileParams
} from "../infrastructure/doctors.api";

export const updateDoctorProfileUseCase = async (
  params: UpdateDoctorProfileParams
): Promise<DoctorDashboard> => {
  
  const profileResult = await updateDoctorProfileAPI(params);

  if (params.workSchedule) {
    try {
      await updateDoctorScheduleAPI(params.workSchedule);
      profileResult.doctor.workSchedule = params.workSchedule;
    } catch (error) {
      console.error("Error actualizando horarios:", error);
    }
  }

  return profileResult;
};