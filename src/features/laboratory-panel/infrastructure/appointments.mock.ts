// Función para generar fechas del mes actual
const getCurrentMonthDates = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  
  return {
    today: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    day1: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.max(1, day - 2)).padStart(2, "0")}`,
    day2: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.max(1, day - 1)).padStart(2, "0")}`,
    day3: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    day4: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(31, day + 1)).padStart(2, "0")}`,
    day5: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(31, day + 2)).padStart(2, "0")}`,
    day6: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(31, day + 3)).padStart(2, "0")}`,
    day7: `${year}-${String(month + 1).padStart(2, "0")}-${String(Math.min(31, day + 4)).padStart(2, "0")}`,
  };
};

export interface LaboratoryAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string; // Tipo de examen
  notes?: string;
  status?: "pending" | "completed" | "finalizada" | "cancelled";
}

// Mock data para citas - distribuidas en diferentes fechas del mes actual
export const generateMockAppointments = (): LaboratoryAppointment[] => {
  const dates = getCurrentMonthDates();
  return [
    {
      id: "1",
      patientName: "María García",
      patientEmail: "maria.garcia@email.com",
      patientPhone: "+593 99 123 4567",
      date: dates.day1,
      time: "08:00",
      reason: "Hemograma completo",
      notes: "Ayuno de 8 horas requerido",
    },
    {
      id: "2",
      patientName: "Juan López",
      patientEmail: "juan.lopez@email.com",
      patientPhone: "+593 99 234 5678",
      date: dates.day1,
      time: "10:30",
      reason: "Perfil lipídico",
      notes: "Ayuno de 12 horas",
      status: "completed",
    },
    {
      id: "3",
      patientName: "Ana Martínez",
      patientEmail: "ana.martinez@email.com",
      patientPhone: "+593 99 345 6789",
      date: dates.day2,
      time: "09:00",
      reason: "Examen de orina completo",
      status: "pending",
    },
    {
      id: "4",
      patientName: "Carlos Rodríguez",
      patientEmail: "carlos.rodriguez@email.com",
      patientPhone: "+593 99 456 7890",
      date: dates.day3,
      time: "11:00",
      reason: "Glicemia en ayunas",
      notes: "Ayuno de 8 horas",
      status: "pending",
    },
    {
      id: "5",
      patientName: "Laura Sánchez",
      patientEmail: "laura.sanchez@email.com",
      patientPhone: "+593 99 567 8901",
      date: dates.day4,
      time: "14:00",
      reason: "Perfil tiroideo",
      status: "completed",
    },
    {
      id: "6",
      patientName: "Pedro González",
      patientEmail: "pedro.gonzalez@email.com",
      patientPhone: "+593 99 678 9012",
      date: dates.day5,
      time: "15:30",
      reason: "Hemograma y química sanguínea",
      status: "cancelled",
    },
    {
      id: "7",
      patientName: "Sofía Ramírez",
      patientEmail: "sofia.ramirez@email.com",
      patientPhone: "+593 99 789 0123",
      date: dates.day6,
      time: "08:30",
      reason: "Examen general de rutina",
      status: "pending",
    },
  ];
};

