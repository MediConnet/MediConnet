// Función helper para obtener fecha futura
const getFutureDate = (daysFromToday: number) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysFromToday);
  return `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, "0")}-${String(futureDate.getDate()).padStart(2, "0")}`;
};

// Función helper para obtener fecha pasada
const getPastDate = (daysAgo: number) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysAgo);
  return `${pastDate.getFullYear()}-${String(pastDate.getMonth() + 1).padStart(2, "0")}-${String(pastDate.getDate()).padStart(2, "0")}`;
};

// Función para generar fechas futuras (solo del día de hoy en adelante)
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

// Mock data para citas - solo fechas futuras desde hoy
export const generateMockAppointments = (): DoctorAppointment[] => {
  const dates = getCurrentMonthDates();
  const now = new Date();
  const currentHour = now.getHours();
  
  // Para las citas de hoy, usar horarios futuros (al menos 1 hora después de ahora)
  const getTodayTime = (offsetHours: number) => {
    const hour = Math.max(currentHour + offsetHours, 9); // Mínimo 9:00 AM
    return `${String(hour).padStart(2, "0")}:00`;
  };
  
  return [
    // Citas pasadas (completadas) para reportes
    {
      id: "past-1",
      patientName: "María García",
      patientEmail: "maria.garcia@email.com",
      patientPhone: "+593 99 123 4567",
      date: getPastDate(2), // Hace 2 días
      time: "10:00",
      reason: "Consulta de seguimiento post-operatorio",
      status: "completed",
      paymentMethod: "card",
      price: 50,
    },
    {
      id: "past-2",
      patientName: "Juan López",
      patientEmail: "juan.lopez@email.com",
      patientPhone: "+593 99 234 5678",
      date: getPastDate(3), // Hace 3 días
      time: "14:00",
      reason: "Primera consulta médica general",
      status: "completed",
      paymentMethod: "cash",
      price: 45,
    },
    {
      id: "past-3",
      patientName: "Ana Martínez",
      patientEmail: "ana.martinez@email.com",
      patientPhone: "+593 99 345 6789",
      date: getPastDate(5), // Hace 5 días
      time: "09:30",
      reason: "Control de presión arterial",
      status: "completed",
      paymentMethod: "card",
      price: 40,
    },
    {
      id: "past-4",
      patientName: "Carlos Rodríguez",
      patientEmail: "carlos.rodriguez@email.com",
      patientPhone: "+593 99 456 7890",
      date: getPastDate(7), // Hace 7 días
      time: "11:00",
      reason: "Revisión de resultados de laboratorio",
      status: "completed",
      paymentMethod: "card",
      price: 55,
    },
    {
      id: "past-5",
      patientName: "Laura Sánchez",
      patientEmail: "laura.sanchez@email.com",
      patientPhone: "+593 99 567 8901",
      date: getPastDate(10), // Hace 10 días
      time: "15:00",
      reason: "Consulta ginecológica",
      status: "completed",
      paymentMethod: "card",
      price: 75,
    },
    {
      id: "past-6",
      patientName: "Pedro González",
      patientEmail: "pedro.gonzalez@email.com",
      patientPhone: "+593 99 678 9012",
      date: getPastDate(14), // Hace 14 días
      time: "10:30",
      reason: "Seguimiento de tratamiento para diabetes",
      status: "completed",
      paymentMethod: "card",
      price: 60,
    },
    
    // Citas de hoy
    {
      id: "1",
      patientName: "María García",
      patientEmail: "maria.garcia@email.com",
      patientPhone: "+593 99 123 4567",
      date: dates.day1, // Hoy
      time: getTodayTime(2), // 2 horas después de ahora
      reason: "Consulta de seguimiento post-operatorio",
      notes: "Paciente requiere revisión de herida quirúrgica",
      status: "paid",
      paymentMethod: "card",
      price: 50,
    },
    {
      id: "2",
      patientName: "Juan López",
      patientEmail: "juan.lopez@email.com",
      patientPhone: "+593 99 234 5678",
      date: dates.day1, // Hoy
      time: getTodayTime(4), // 4 horas después de ahora
      reason: "Primera consulta médica general",
      notes: "Nuevo paciente, requiere evaluación inicial",
      status: "pending",
      paymentMethod: "cash",
      price: 45,
    },
    {
      id: "3",
      patientName: "Ana Martínez",
      patientEmail: "ana.martinez@email.com",
      patientPhone: "+593 99 345 6789",
      date: dates.day1, // Hoy
      time: getTodayTime(6), // 6 horas después de ahora
      reason: "Control de presión arterial",
      status: "paid",
      paymentMethod: "card",
      price: 40,
    },
    
    // Citas de mañana
    {
      id: "4",
      patientName: "Carlos Rodríguez",
      patientEmail: "carlos.rodriguez@email.com",
      patientPhone: "+593 99 456 7890",
      date: dates.day2, // Mañana
      time: "09:00",
      reason: "Revisión de resultados de laboratorio",
      notes: "Paciente traerá exámenes de sangre y orina",
      status: "paid",
      paymentMethod: "card",
      price: 55,
    },
    {
      id: "5",
      patientName: "Laura Sánchez",
      patientEmail: "laura.sanchez@email.com",
      patientPhone: "+593 99 567 8901",
      date: dates.day2, // Mañana
      time: "11:30",
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
      date: dates.day2, // Mañana
      time: "14:00",
      reason: "Seguimiento de tratamiento para diabetes",
      status: "paid",
      paymentMethod: "card",
      price: 60,
    },
    {
      id: "7",
      patientName: "Sofía Ramírez",
      patientEmail: "sofia.ramirez@email.com",
      patientPhone: "+593 99 789 0123",
      date: dates.day2, // Mañana
      time: "16:00",
      reason: "Consulta de rutina y chequeo general",
      status: "pending",
      paymentMethod: "cash",
      price: 45,
    },
    
    // Citas pasado mañana
    {
      id: "8",
      patientName: "Roberto Fernández",
      patientEmail: "roberto.fernandez@email.com",
      patientPhone: "+593 99 890 1234",
      date: dates.day3, // Pasado mañana
      time: "08:30",
      reason: "Consulta dermatológica",
      notes: "Revisión de lunares",
      status: "paid",
      paymentMethod: "card",
      price: 65,
    },
    {
      id: "9",
      patientName: "Carmen Torres",
      patientEmail: "carmen.torres@email.com",
      patientPhone: "+593 99 901 2345",
      date: dates.day3, // Pasado mañana
      time: "10:00",
      reason: "Control prenatal",
      status: "paid",
      paymentMethod: "card",
      price: 70,
    },
    {
      id: "10",
      patientName: "Diego Morales",
      patientEmail: "diego.morales@email.com",
      patientPhone: "+593 98 123 4567",
      date: dates.day3, // Pasado mañana
      time: "13:00",
      reason: "Consulta por alergias estacionales",
      status: "pending",
      paymentMethod: "cash",
      price: 45,
    },
    
    // Citas +3 días
    {
      id: "11",
      patientName: "Isabella Cruz",
      patientEmail: "isabella.cruz@email.com",
      patientPhone: "+593 98 234 5678",
      date: dates.day4,
      time: "09:00",
      reason: "Consulta psicológica",
      notes: "Primera sesión",
      status: "paid",
      paymentMethod: "card",
      price: 80,
    },
    {
      id: "12",
      patientName: "Andrés Vargas",
      patientEmail: "andres.vargas@email.com",
      patientPhone: "+593 98 345 6789",
      date: dates.day4,
      time: "11:00",
      reason: "Control cardiológico",
      status: "paid",
      paymentMethod: "card",
      price: 90,
    },
    {
      id: "13",
      patientName: "Valentina Herrera",
      patientEmail: "valentina.herrera@email.com",
      patientPhone: "+593 98 456 7890",
      date: dates.day4,
      time: "15:00",
      reason: "Consulta pediátrica",
      status: "pending",
      paymentMethod: "cash",
      price: 50,
    },
    
    // Citas +4 días
    {
      id: "14",
      patientName: "Fernando Jiménez",
      patientEmail: "fernando.jimenez@email.com",
      patientPhone: "+593 98 567 8901",
      date: dates.day5,
      time: "10:00",
      reason: "Consulta de medicina general",
      status: "paid",
      paymentMethod: "card",
      price: 45,
    },
    {
      id: "15",
      patientName: "Patricia Moreno",
      patientEmail: "patricia.moreno@email.com",
      patientPhone: "+593 98 678 9012",
      date: dates.day5,
      time: "14:30",
      reason: "Seguimiento de tratamiento hipertensión",
      status: "paid",
      paymentMethod: "card",
      price: 50,
    },
    
    // Citas +5 días
    {
      id: "16",
      patientName: "Luis Castro",
      patientEmail: "luis.castro@email.com",
      patientPhone: "+593 98 789 0123",
      date: getFutureDate(5),
      time: "09:30",
      reason: "Consulta nutricional",
      status: "pending",
      paymentMethod: "cash",
      price: 60,
    },
    {
      id: "17",
      patientName: "Gabriela Ruíz",
      patientEmail: "gabriela.ruiz@email.com",
      patientPhone: "+593 98 890 1234",
      date: getFutureDate(5),
      time: "11:00",
      reason: "Control ginecológico",
      status: "paid",
      paymentMethod: "card",
      price: 75,
    },
    {
      id: "18",
      patientName: "Miguel Ángel Pérez",
      patientEmail: "miguel.perez@email.com",
      patientPhone: "+593 97 123 4567",
      date: getFutureDate(5),
      time: "16:00",
      reason: "Consulta traumatológica",
      notes: "Dolor en rodilla izquierda",
      status: "pending",
      paymentMethod: "cash",
      price: 70,
    },
    
    // Citas +7 días
    {
      id: "19",
      patientName: "Natalia Ortiz",
      patientEmail: "natalia.ortiz@email.com",
      patientPhone: "+593 97 234 5678",
      date: dates.day7, // +7 días
      time: "10:30",
      reason: "Consulta de rutina y chequeo general",
      status: "pending",
      paymentMethod: "cash",
      price: 45,
    },
    {
      id: "20",
      patientName: "Ricardo Silva",
      patientEmail: "ricardo.silva@email.com",
      patientPhone: "+593 97 345 6789",
      date: dates.day7, // +7 días
      time: "13:00",
      reason: "Consulta oftalmológica",
      status: "paid",
      paymentMethod: "card",
      price: 85,
    },
    
    // Más citas distribuidas en las próximas semanas
    {
      id: "21",
      patientName: "Daniela Mendoza",
      patientEmail: "daniela.mendoza@email.com",
      patientPhone: "+593 97 456 7890",
      date: getFutureDate(10),
      time: "09:00",
      reason: "Control de asma",
      status: "paid",
      paymentMethod: "card",
      price: 55,
    },
    {
      id: "22",
      patientName: "Sergio Núñez",
      patientEmail: "sergio.nunez@email.com",
      patientPhone: "+593 97 567 8901",
      date: getFutureDate(10),
      time: "14:00",
      reason: "Consulta urológica",
      status: "pending",
      paymentMethod: "cash",
      price: 75,
    },
    {
      id: "23",
      patientName: "Monica Espinoza",
      patientEmail: "monica.espinoza@email.com",
      patientPhone: "+593 97 678 9012",
      date: getFutureDate(14),
      time: "10:00",
      reason: "Consulta endocrinológica",
      status: "paid",
      paymentMethod: "card",
      price: 80,
    },
    {
      id: "24",
      patientName: "José Antonio Vega",
      patientEmail: "jose.vega@email.com",
      patientPhone: "+593 97 789 0123",
      date: getFutureDate(14),
      time: "15:30",
      reason: "Consulta psiquiátrica",
      notes: "Control de medicación",
      status: "pending",
      paymentMethod: "cash",
      price: 95,
    },
  ];
};

