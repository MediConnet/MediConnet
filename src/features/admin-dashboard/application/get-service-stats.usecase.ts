import type { ServiceStats } from "../domain/service-stats.entity";
import { getDashboardStatsAPI } from "../infrastructure/dashboard.api";

export const getServiceStatsUseCase = async (): Promise<ServiceStats> => {
  const stats = await getDashboardStatsAPI();
  return {
    doctorCount: stats.servicesByType.doctors,
    pharmacyCount: stats.servicesByType.pharmacies,
    laboratoryCount: stats.servicesByType.laboratories,
    ambulanceCount: stats.servicesByType.ambulances,
    suppliesCount: stats.servicesByType.supplies,
    clinicaCount: stats.servicesByType.clinicas,
    aestheticCount: stats.servicesByType.aesthetic,
  };
};