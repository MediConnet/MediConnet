import type { SupplyDashboard } from "../domain/SupplyDashboard.entity";

// Mock data para el dashboard de insumos médicos
const mockSupplyDashboard: SupplyDashboard = {
  visits: 1626,
  contacts: 113,
  reviews: 2,
  rating: 4.5,
  supply: {
    name: "Insumos Médicos Plus",
    email: "insumos@medicones.com",
    whatsapp: "+593 99 111 2222",
    address: "Av. 6 de Diciembre N24-120, Quito, Ecuador",
    description: "Distribuidora de insumos y equipo médico. Vendemos al mayoreo y menudeo. Guantes, jeringas, material de curación, equipo de diagnóstico y más.",
    schedule: "Lun-Vie 8:00-18:00",
    workSchedule: [
      { day: 'monday', enabled: true, startTime: '08:00', endTime: '18:00' },
      { day: 'tuesday', enabled: true, startTime: '08:00', endTime: '18:00' },
      { day: 'wednesday', enabled: true, startTime: '08:00', endTime: '18:00' },
      { day: 'thursday', enabled: true, startTime: '08:00', endTime: '18:00' },
      { day: 'friday', enabled: true, startTime: '08:00', endTime: '18:00' },
    ],
  },
  reviewsList: [
    {
      id: "review-1",
      userName: "Dr. Carlos Mendoza",
      rating: 5,
      comment: "Excelente servicio y productos de calidad. Muy recomendado.",
      date: new Date().toISOString().split("T")[0], // Hoy
    },
    {
      id: "review-2",
      userName: "Clínica San José",
      rating: 4,
      comment: "Buenos precios y entrega rápida. Seguiremos comprando aquí.",
      date: new Date().toISOString().split("T")[0], // Hoy
    },
  ],
};

export const getSupplyDashboardAPI = async (_userId: string): Promise<SupplyDashboard> => {
  // TODO: Reemplazar con llamada real a la API cuando esté disponible
  // const response = await httpClient.get<SupplyDashboard>(`/supplies/${userId}/dashboard`);
  // return response.data;
  
  // Por ahora retornamos datos mock o desde localStorage si existe
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        try {
          const saved = localStorage.getItem(`supply-profile-${_userId}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            resolve(parsed);
          } else {
            resolve(mockSupplyDashboard);
          }
        } catch (error) {
          console.error('Error loading supply dashboard from localStorage:', error);
          resolve(mockSupplyDashboard);
        }
      }, 500);
    } catch (error) {
      console.error('Error in getSupplyDashboardAPI:', error);
      reject(error);
    }
  });
};

