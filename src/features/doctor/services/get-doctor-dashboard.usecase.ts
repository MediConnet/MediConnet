import { getDoctorDashboardAPI } from "../api/doctors.api";
import type { DoctorDashboard } from "../types/DoctorDashboard.entity";

export const getDoctorDashboardUseCase = async (userId: string): Promise<DoctorDashboard> => {
  return await getDoctorDashboardAPI(userId);
};
