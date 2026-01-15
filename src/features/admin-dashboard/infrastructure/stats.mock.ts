import type { ActiveService, ServiceStats } from "../../admin-dashboard/domain/service-stats.entity";

export const MOCK_SERVICE_STATS: ServiceStats = {
  doctorCount: 1,
  pharmacyCount: 1,
  laboratoryCount: 0,
  ambulanceCount: 1,
  suppliesCount: 0,
};

export const MOCK_ACTIVE_SERVICES: ActiveService[] = [
  {
    id: "1",
    name: "Ambulancias Rápidas",
    location: "Guayaquil",
    type: "ambulance",
  },
  {
    id: "2",
    name: "Dr. Roberto Sánchez",
    location: "Quito",
    type: "doctor",
  },
  {
    id: "3",
    name: "Farmacia Salud Total",
    location: "Cuenca",
    type: "pharmacy",
  },
];

export const getServiceStatsMock = (): Promise<ServiceStats> => {
  return Promise.resolve(MOCK_SERVICE_STATS);
};

export const getActiveServicesMock = (): Promise<ActiveService[]> => {
  return Promise.resolve(MOCK_ACTIVE_SERVICES);
};