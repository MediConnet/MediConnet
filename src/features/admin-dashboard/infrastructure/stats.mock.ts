import type { ActiveService, ServiceStats } from "../../admin-dashboard/domain/service-stats.entity";

export const MOCK_SERVICE_STATS: ServiceStats = {
  doctorCount: 45,
  pharmacyCount: 32,
  laboratoryCount: 18,
  ambulanceCount: 12,
  suppliesCount: 8,
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
  {
    id: "4",
    name: "Dr. María González",
    location: "Quito",
    type: "doctor",
  },
  {
    id: "5",
    name: "Laboratorio Clínico Vital",
    location: "Guayaquil",
    type: "laboratory",
  },
  {
    id: "6",
    name: "Farmacia Fybeca",
    location: "Quito",
    type: "pharmacy",
  },
  {
    id: "7",
    name: "Dr. Carlos Mendoza",
    location: "Cuenca",
    type: "doctor",
  },
  {
    id: "8",
    name: "Ambulancias Vida",
    location: "Quito",
    type: "ambulance",
  },
  {
    id: "9",
    name: "Insumos Médicos Plus",
    location: "Guayaquil",
    type: "supplies",
  },
  {
    id: "10",
    name: "Laboratorio Diagnóstico",
    location: "Quito",
    type: "laboratory",
  },
  {
    id: "11",
    name: "Farmacia San José",
    location: "Cuenca",
    type: "pharmacy",
  },
  {
    id: "12",
    name: "Dr. Ana Martínez",
    location: "Guayaquil",
    type: "doctor",
  },
];

export const getServiceStatsMock = (): Promise<ServiceStats> => {
  return Promise.resolve(MOCK_SERVICE_STATS);
};

export const getActiveServicesMock = (): Promise<ActiveService[]> => {
  return Promise.resolve(MOCK_ACTIVE_SERVICES);
};