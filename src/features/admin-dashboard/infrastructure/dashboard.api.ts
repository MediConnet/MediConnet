import type { DashboardStats } from "../domain/dashboard-stats.entity";

// Función para obtener fecha y hora reciente
const getRecentDateTime = (hoursAgo: number) => {
  const now = new Date();
  now.setHours(now.getHours() - hoursAgo);
  const day = now.getDate();
  const month = now.toLocaleDateString("es-ES", { month: "long" });
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${day} de ${month} de ${year} - ${hours}:${minutes}`;
};

const MOCK_STATS: DashboardStats = {
  totalServices: { value: 156, trend: '+12% este mes' },
  usersInApp: { value: 12500, trend: '+8% este mes' },
  monthlyContacts: 3420,
  totalCities: 28,
  requestStatus: { pending: 5, approved: 12, rejected: 2 }, 
  servicesByType: {
    doctors: 68,
    pharmacies: 42,
    laboratories: 25,
    ambulances: 8,
    supplies: 13
  },
  recentActivity: [
    { id: '1', type: 'info', message: 'Nueva solicitud de registro: Dra. María González', timestamp: getRecentDateTime(2) },
    { id: '2', type: 'success', message: 'Servicio aprobado: Dr. Roberto Sánchez', timestamp: getRecentDateTime(5) },
    { id: '3', type: 'info', message: 'Nueva solicitud de registro: Farmacia del Pueblo', timestamp: getRecentDateTime(8) },
    { id: '4', type: 'warning', message: 'Nuevo anuncio creado: Chequeo Cardiológico Completo', timestamp: getRecentDateTime(12) },
    { id: '5', type: 'error', message: 'Solicitud rechazada: Insumos Médicos Plus (documentos incompletos)', timestamp: getRecentDateTime(18) },
    { id: '6', type: 'success', message: 'Servicio aprobado: Laboratorio Clínico Vital', timestamp: getRecentDateTime(24) },
    { id: '7', type: 'info', message: 'Nueva solicitud de anuncio: Promoción de Verano', timestamp: getRecentDateTime(30) },
    { id: '8', type: 'success', message: 'Anuncio aprobado: Descuento 20% en Medicamentos', timestamp: getRecentDateTime(36) },
  ]
};

export const getDashboardStatsAPI = async (): Promise<DashboardStats> => {
  return Promise.resolve(MOCK_STATS);
};