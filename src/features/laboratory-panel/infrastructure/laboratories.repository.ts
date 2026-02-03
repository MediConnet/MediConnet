import { httpClient, extractData } from '../../../shared/lib/http';
import type { LaboratoryDashboard } from "../domain/LaboratoryDashboard.entity";

/**
 * API: Obtener dashboard de laboratorio
 * Endpoint: GET /api/laboratories/:userId/dashboard
 */
export const getLaboratoryDashboardAPI = async (userId: string): Promise<LaboratoryDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: LaboratoryDashboard }>(
    `/laboratories/${userId}/dashboard`
  );
  return extractData(response);
};
