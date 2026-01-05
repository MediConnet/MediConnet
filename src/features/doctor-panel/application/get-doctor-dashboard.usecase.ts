import { getDoctorDashboardAPI } from "../infrastructure/doctors.api";  
import type { DoctorDashboard } from "../domain/DoctorDashboard.entity";

export const getDoctorDashboardUseCase = async (userId: string): Promise<DoctorDashboard>  => {
  return await getDoctorDashboardAPI(userId);
};
