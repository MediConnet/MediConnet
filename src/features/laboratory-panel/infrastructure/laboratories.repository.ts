import type { LaboratoryDashboard } from "../domain/LaboratoryDashboard.entity";

// Mock data para el dashboard del laboratorio
const mockLaboratoryDashboard: LaboratoryDashboard = {
  visits: 1240,
  contacts: 88,
  reviews: 45,
  rating: 4.7,
  laboratory: {
    name: "Laboratorio Central",
    email: "lab@medicones.com",
    whatsapp: "+593 99 123 4567",
    address: "Av. Principal 456, Quito",
    description: "Laboratorio clínico profesional con más de 15 años de experiencia",
    schedule: "7:00am - 7:00pm",
    workSchedule: [
      { day: 'monday', enabled: true, startTime: '07:00', endTime: '19:00' },
      { day: 'tuesday', enabled: true, startTime: '07:00', endTime: '19:00' },
      { day: 'wednesday', enabled: true, startTime: '07:00', endTime: '19:00' },
      { day: 'thursday', enabled: true, startTime: '07:00', endTime: '19:00' },
      { day: 'friday', enabled: true, startTime: '07:00', endTime: '19:00' },
    ],
  },
};

export const getLaboratoryDashboardAPI = async (_userId: string): Promise<LaboratoryDashboard> => {
  // TODO: Reemplazar con llamada real a la API cuando esté disponible
  // const response = await httpClient.get<LaboratoryDashboard>(`/laboratories/${userId}/dashboard`);
  // return response.data;
  
  // Por ahora retornamos datos mock o desde localStorage si existe
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        try {
          const saved = localStorage.getItem(`laboratory-profile-${_userId}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            resolve(parsed);
          } else {
            resolve(mockLaboratoryDashboard);
          }
        } catch (error) {
          console.error('Error loading laboratory dashboard from localStorage:', error);
          resolve(mockLaboratoryDashboard);
        }
      }, 500);
    } catch (error) {
      console.error('Error in getLaboratoryDashboardAPI:', error);
      reject(error);
    }
  });
};
