import type { DashboardStats } from "../domain/dashboard-stats.entity";

const MOCK_STATS: DashboardStats = {
  totalServices: 156,
  usersInApp: 12500,
  monthlyContacts: 3420,
  totalCities: 28,
  pendingRequests: 2,
  approvedRequests: 3,
  rejectedRequests: 2,
  servicesByType: {
    doctors: 68,
    pharmacies: 42,
    laboratories: 25,
    ambulances: 8,
    supplies: 13
  }
};

// Simulamos una llamada asíncrona a la API
export const getDashboardStatsAPI = async (): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATS);
    }, 1000); // Simulamos 1 segundo de carga
  });
};