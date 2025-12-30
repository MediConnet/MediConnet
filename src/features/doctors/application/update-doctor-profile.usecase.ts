import { updateDoctorProfileAPI, type UpdateDoctorProfileParams } from "../infrastructure/doctors.api";
import type { DoctorDashboard } from "../domain/DoctorDashboard.entity";

export const updateDoctorProfileUseCase = async (
  userId: string,
  params: UpdateDoctorProfileParams
): Promise<DoctorDashboard> => {
  return await updateDoctorProfileAPI(userId, params);
};

