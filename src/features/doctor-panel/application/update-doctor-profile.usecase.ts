import type { DoctorDashboard } from "../domain/DoctorDashboard.entity";
import {
  updateDoctorProfileAPI,
  type UpdateDoctorProfileParams
} from "../infrastructure/doctors.api";

export const updateDoctorProfileUseCase = async (
  params: UpdateDoctorProfileParams
): Promise<DoctorDashboard> => {
  
  const profileResult = await updateDoctorProfileAPI(params);

  return profileResult;
};