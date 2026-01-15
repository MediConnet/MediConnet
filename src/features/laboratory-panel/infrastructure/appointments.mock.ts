// Función para generar fechas futuras (solo del día de hoy en adelante)
const getFutureDate = (daysFromToday: number) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysFromToday);
  return `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, "0")}-${String(futureDate.getDate()).padStart(2, "0")}`;
};

const getCurrentMonthDates = () => {
  return {
    today: getFutureDate(0),        // Hoy
    day1: getFutureDate(0),         // Hoy
    day2: getFutureDate(1),         // Mañana
    day3: getFutureDate(2),         // Pasado mañana
    day4: getFutureDate(3),         // +3 días
    day5: getFutureDate(4),         // +4 días
    day6: getFutureDate(5),         // +5 días
    day7: getFutureDate(7),         // +7 días
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
    {
      id: "8",
      patientName: "Roberto Fernández",
      patientEmail: "roberto.fernandez@email.com",
      patientPhone: "+593 99 890 1234",
      date: dates.day2,
      time: "13:00",
      reason: "Perfil hepático completo",
      notes: "Ayuno de 8 horas",
      status: "pending",
    },
    {
      id: "9",
      patientName: "Carmen Torres",
      patientEmail: "carmen.torres@email.com",
      patientPhone: "+593 99 901 2345",
      date: dates.day3,
      time: "09:30",
      reason: "Hemograma y coagulación",
      status: "pending",
    },
    {
      id: "10",
      patientName: "Diego Morales",
      patientEmail: "diego.morales@email.com",
      patientPhone: "+593 98 123 4567",
      date: dates.day4,
      time: "10:00",
      reason: "Perfil renal completo",
      notes: "Ayuno de 8 horas",
      status: "pending",
    },
    {
      id: "11",
      patientName: "Isabella Cruz",
      patientEmail: "isabella.cruz@email.com",
      patientPhone: "+593 98 234 5678",
      date: dates.day5,
      time: "11:30",
      reason: "Examen de heces",
      status: "pending",
    },
    {
      id: "12",
      patientName: "Andrés Vargas",
      patientEmail: "andres.vargas@email.com",
      patientPhone: "+593 98 345 6789",
      date: dates.day7,
      time: "14:00",
      reason: "Perfil completo pre-operatorio",
      notes: "Ayuno de 12 horas",
      status: "pending",
    },
  ];
};

