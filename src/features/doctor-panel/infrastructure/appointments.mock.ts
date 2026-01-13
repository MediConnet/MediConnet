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

export interface DoctorAppointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  reason: string; // Razón de la cita
  notes?: string;
  status?: "pending" | "paid" | "completed" | "finalizada" | "cancelled" | "no-show";
  paymentMethod?: "card" | "cash";
  price?: number;
}

// Mock data para citas - distribuidas en diferentes fechas del mes actual
export const generateMockAppointments = (): DoctorAppointment[] => {
  const dates = getCurrentMonthDates();
  return [
    {
      id: "1",
      patientName: "María García",
      patientEmail: "maria.garcia@email.com",
      patientPhone: "+593 99 123 4567",
      date: dates.day1,
      time: "10:00",
      reason: "Consulta de seguimiento post-operatorio",
      notes: "Paciente requiere revisión de herida quirúrgica",
      status: "completed",
      paymentMethod: "card",
      price: 50,
    },
    {
      id: "2",
      patientName: "Juan López",
      patientEmail: "juan.lopez@email.com",
      patientPhone: "+593 99 234 5678",
      date: dates.day1,
      time: "14:30",
      reason: "Primera consulta médica general",
      notes: "Nuevo paciente, requiere evaluación inicial",
      status: "completed",
      paymentMethod: "cash",
      price: 45,
    },
    {
      id: "3",
      patientName: "Ana Martínez",
      patientEmail: "ana.martinez@email.com",
      patientPhone: "+593 99 345 6789",
      date: dates.day2,
      time: "09:00",
      reason: "Control de presión arterial",
      status: "completed",
      paymentMethod: "card",
      price: 40,
    },
    {
      id: "4",
      patientName: "Carlos Rodríguez",
      patientEmail: "carlos.rodriguez@email.com",
      patientPhone: "+593 99 456 7890",
      date: dates.day3,
      time: "11:00",
      reason: "Revisión de resultados de laboratorio",
      notes: "Paciente traerá exámenes de sangre y orina",
      status: "completed",
      paymentMethod: "card",
      price: 55,
    },
    {
      id: "5",
      patientName: "Laura Sánchez",
      patientEmail: "laura.sanchez@email.com",
      patientPhone: "+593 99 567 8901",
      date: dates.day4,
      time: "15:00",
      reason: "Consulta por dolor de cabeza recurrente",
      status: "pending",
      paymentMethod: "cash",
      price: 50,
    },
    {
      id: "6",
      patientName: "Pedro González",
      patientEmail: "pedro.gonzalez@email.com",
      patientPhone: "+593 99 678 9012",
      date: dates.day5,
      time: "16:00",
      reason: "Seguimiento de tratamiento para diabetes",
      status: "completed",
      paymentMethod: "card",
      price: 60,
    },
    {
      id: "7",
      patientName: "Sofía Ramírez",
      patientEmail: "sofia.ramirez@email.com",
      patientPhone: "+593 99 789 0123",
      date: dates.day6,
      time: "10:30",
      reason: "Consulta de rutina y chequeo general",
      status: "cancelled",
      paymentMethod: "cash",
      price: 45,
    },
  ];
};

