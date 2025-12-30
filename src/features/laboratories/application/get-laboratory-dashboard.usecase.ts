import { getLaboratoryDashboardAPI } from "../infrastructure/laboratories.repository";

export const getLaboratoryDashboardUseCase = async (userId: string) => {
  return await getLaboratoryDashboardAPI(userId);
};
