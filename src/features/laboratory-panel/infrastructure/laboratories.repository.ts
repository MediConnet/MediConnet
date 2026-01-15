import type { LaboratoryDashboard } from "../domain/LaboratoryDashboard.entity";

// Mock data para el dashboard del laboratorio
const mockLaboratoryDashboard: LaboratoryDashboard = {
  visits: 1240,
  contacts: 88,
  reviews: 45,
  rating: 4.7,
  laboratory: {
    id: "lab-001",
    name: "Laboratorio Central",
    logoUrl: undefined,
    email: "lab@medicones.com",
    whatsapp: "+593 99 123 4567",
    address: "Av. Principal 456, Quito, Ecuador",
    description: "Laboratorio clínico profesional con más de 15 años de experiencia",
    schedule: "Lun-Vie 07:00-19:00", 
    workSchedule: [
      { day: 'monday', isOpen: true, startTime: '07:00', endTime: '19:00' },
      { day: 'tuesday', isOpen: true, startTime: '07:00', endTime: '19:00' },
      { day: 'wednesday', isOpen: true, startTime: '07:00', endTime: '19:00' },
      { day: 'thursday', isOpen: true, startTime: '07:00', endTime: '19:00' },
      { day: 'friday', isOpen: true, startTime: '07:00', endTime: '19:00' },
      { day: 'saturday', isOpen: false, startTime: '09:00', endTime: '13:00' },
      { day: 'sunday', isOpen: false, startTime: '09:00', endTime: '13:00' },
    ],
    studies: [
      {
        id: "study-1",
        name: "Hemograma completo",
        preparation: "Ayuno de 8 horas requerido",
      },
      {
        id: "study-2",
        name: "Perfil lipídico",
        preparation: "Ayuno de 12 horas",
      },
      {
        id: "study-3",
        name: "Examen de orina completo",
        preparation: "Muestra de primera orina de la mañana",
      },
      {
        id: "study-4",
        name: "Glicemia en ayunas",
        preparation: "Ayuno de 8 horas",
      },
      {
        id: "study-5",
        name: "Perfil tiroideo completo",
        preparation: "Ayuno de 8 horas",
      },
      {
        id: "study-6",
        name: "Perfil hepático",
        preparation: "Ayuno de 8 horas",
      },
      {
        id: "study-7",
        name: "Perfil renal",
        preparation: "Ayuno de 8 horas",
      },
      {
        id: "study-8",
        name: "Química sanguínea completa",
        preparation: "Ayuno de 12 horas",
      },
      {
        id: "study-9",
        name: "Examen de heces",
        preparation: "Muestra fresca, sin conservantes",
      },
      {
        id: "study-10",
        name: "Hemoglobina glicosilada (HbA1c)",
        preparation: "No requiere ayuno",
      },
      {
        id: "study-11",
        name: "Perfil de coagulación",
        preparation: "Ayuno de 8 horas",
      },
      {
        id: "study-12",
        name: "Ácido úrico",
        preparation: "Ayuno de 8 horas",
      },
      {
        id: "study-13",
        name: "Vitamina D",
        preparation: "Ayuno de 8 horas",
      },
      {
        id: "study-14",
        name: "PSA (Antígeno prostático)",
        preparation: "Ayuno de 8 horas",
      },
      {
        id: "study-15",
        name: "Perfil pre-operatorio completo",
        preparation: "Ayuno de 12 horas",
      },
    ],
    location: {
      latitude: -0.1807,
      longitude: -78.4678,
      address: "Av. Principal 456, Quito, Ecuador",
    },
  },
};

export const getLaboratoryDashboardAPI = async (_userId: string): Promise<LaboratoryDashboard> => {
  // TODO: Reemplazar con llamada real a la API cuando esté disponible
  
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