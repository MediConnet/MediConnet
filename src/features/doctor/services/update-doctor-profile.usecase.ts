import type { DoctorDashboard } from "../types/DoctorDashboard.entity";
import {
  updateDoctorProfileAPI,
  type UpdateDoctorProfileParams
} from "../api/doctors.api";

export const updateDoctorProfileUseCase = async (
  params: UpdateDoctorProfileParams
): Promise<DoctorDashboard> => {

  const profileResult = await updateDoctorProfileAPI(params);

  return profileResult;
};
