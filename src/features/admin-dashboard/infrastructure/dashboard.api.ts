import type { DashboardStats } from "../domain/dashboard-stats.entity";

const MOCK_STATS: DashboardStats = {
  totalServices: { value: 156, trend: '+12% este mes' },
  usersInApp: { value: 12500, trend: '+8% este mes' },
  monthlyContacts: 3420,
  totalCities: 28,
  requestStatus: { pending: 3, approved: 3, rejected: 1 }, 
  servicesByType: {
    doctors: 68,
    pharmacies: 42,
    laboratories: 25,
    ambulances: 8,
    supplies: 13
  },
  recentActivity: [
    { id: '1', type: 'info', message: 'Nueva solicitud de registro: Dra. María González', timestamp: '2024-01-20 - 14:30' },
    { id: '2', type: 'success', message: 'Servicio aprobado: Dr. Roberto Sánchez', timestamp: '2024-01-19 - 11:15' },
    { id: '3', type: 'info', message: 'Nueva solicitud de registro: Farmacia del Pueblo', timestamp: '2024-01-19 - 09:45' },
    { id: '4', type: 'warning', message: 'Nuevo anuncio creado: Chequeo Cardiológico Completo', timestamp: '2024-01-18 - 16:20' },
    { id: '5', type: 'error', message: 'Solicitud rechazada: Insumos Médicos Plus (documentos incompletos)', timestamp: '2024-01-17 - 10:00' },
  ]
};

export const getDashboardStatsAPI = async (): Promise<DashboardStats> => {
  return Promise.resolve(MOCK_STATS);
};