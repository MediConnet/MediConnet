import type { Patient } from "../domain/Patient.entity";
import { generateMockAppointments, type DoctorAppointment } from "../infrastructure/appointments.mock";

// Función para obtener fechas pasadas recientes
const getPastDate = (daysAgo: number) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysAgo);
  return pastDate.toISOString().split("T")[0];
};

// Generar pacientes automáticamente desde las citas
export const generatePatientsFromAppointments = (appointments: DoctorAppointment[]): Patient[] => {
  const patientMap = new Map<string, Patient>();

  // Incluir citas completadas, pagadas y atendidas
  const relevantAppointments = appointments.filter((apt) => 
    apt.status === "completed" || apt.status === "paid"
  );

  relevantAppointments.forEach((apt) => {
    const patientId = apt.patientName.toLowerCase().replace(/\s+/g, "-");
    
    if (!patientMap.has(patientId)) {
      patientMap.set(patientId, {
        id: patientId,
        name: apt.patientName,
        phone: apt.patientPhone || `09${Math.floor(Math.random() * 90000000) + 10000000}`,
        email: apt.patientEmail || `${patientId}@email.com`,
        appointments: [],
      });
    }

    const patient = patientMap.get(patientId)!;
    patient.appointments.push({
      id: apt.id,
      date: apt.date,
      time: apt.time,
      reason: apt.reason,
      status: apt.status === "completed" ? "completed" : "completed",
      paymentMethod: apt.paymentMethod || (Math.random() > 0.5 ? "card" : "cash"),
      amount: apt.price,
    });
  });

  return Array.from(patientMap.values());
};

// Pacientes mock adicionales con historiales completos
const getAdditionalPatientsMock = (): Patient[] => {
  return [
    {
      id: "maria-garcia",
      name: "María García",
      phone: "+593 99 123 4567",
      email: "maria.garcia@email.com",
      appointments: [
        {
          id: "apt-1",
          date: getPastDate(5),
          time: "10:00",
          reason: "Consulta de seguimiento post-operatorio",
          status: "completed",
          paymentMethod: "card",
          amount: 50,
        },
        {
          id: "apt-2",
          date: getPastDate(30),
          time: "14:00",
          reason: "Control de presión arterial",
          status: "completed",
          paymentMethod: "cash",
          amount: 45,
        },
        {
          id: "apt-3",
          date: getPastDate(60),
          time: "09:30",
          reason: "Consulta general",
          status: "completed",
          paymentMethod: "card",
          amount: 50,
        },
      ],
    },
    {
      id: "juan-lopez",
      name: "Juan López",
      phone: "+593 99 234 5678",
      email: "juan.lopez@email.com",
      appointments: [
        {
          id: "apt-4",
          date: getPastDate(3),
          time: "11:00",
          reason: "Primera consulta médica general",
          status: "completed",
          paymentMethod: "cash",
          amount: 45,
        },
        {
          id: "apt-5",
          date: getPastDate(25),
          time: "15:30",
          reason: "Revisión de resultados de laboratorio",
          status: "completed",
          paymentMethod: "card",
          amount: 55,
        },
      ],
    },
    {
      id: "ana-martinez",
      name: "Ana Martínez",
      phone: "+593 99 345 6789",
      email: "ana.martinez@email.com",
      appointments: [
        {
          id: "apt-6",
          date: getPastDate(7),
          time: "09:00",
          reason: "Control de presión arterial",
          status: "completed",
          paymentMethod: "card",
          amount: 40,
        },
        {
          id: "apt-7",
          date: getPastDate(45),
          time: "10:00",
          reason: "Consulta por alergias",
          status: "completed",
          paymentMethod: "cash",
          amount: 45,
        },
        {
          id: "apt-8",
          date: getPastDate(90),
          time: "16:00",
          reason: "Chequeo anual",
          status: "completed",
          paymentMethod: "card",
          amount: 60,
        },
      ],
    },
    {
      id: "carlos-rodriguez",
      name: "Carlos Rodríguez",
      phone: "+593 99 456 7890",
      email: "carlos.rodriguez@email.com",
      appointments: [
        {
          id: "apt-9",
          date: getPastDate(2),
          time: "11:00",
          reason: "Revisión de resultados de laboratorio",
          status: "completed",
          paymentMethod: "card",
          amount: 55,
        },
        {
          id: "apt-10",
          date: getPastDate(20),
          time: "14:00",
          reason: "Seguimiento de tratamiento para diabetes",
          status: "completed",
          paymentMethod: "card",
          amount: 60,
        },
        {
          id: "apt-11",
          date: getPastDate(50),
          time: "08:30",
          reason: "Consulta cardiológica",
          status: "completed",
          paymentMethod: "card",
          amount: 70,
        },
        {
          id: "apt-12",
          date: getPastDate(80),
          time: "13:00",
          reason: "Control de medicación",
          status: "completed",
          paymentMethod: "cash",
          amount: 50,
        },
      ],
    },
    {
      id: "laura-sanchez",
      name: "Laura Sánchez",
      phone: "+593 99 567 8901",
      email: "laura.sanchez@email.com",
      appointments: [
        {
          id: "apt-13",
          date: getPastDate(1),
          time: "15:00",
          reason: "Consulta por dolor de cabeza recurrente",
          status: "completed",
          paymentMethod: "cash",
          amount: 50,
        },
        {
          id: "apt-14",
          date: getPastDate(35),
          time: "10:30",
          reason: "Consulta ginecológica",
          status: "completed",
          paymentMethod: "card",
          amount: 75,
        },
      ],
    },
    {
      id: "pedro-gonzalez",
      name: "Pedro González",
      phone: "+593 99 678 9012",
      email: "pedro.gonzalez@email.com",
      appointments: [
        {
          id: "apt-15",
          date: getPastDate(4),
          time: "16:00",
          reason: "Seguimiento de tratamiento para diabetes",
          status: "completed",
          paymentMethod: "card",
          amount: 60,
        },
        {
          id: "apt-16",
          date: getPastDate(28),
          time: "11:30",
          reason: "Control de glicemia",
          status: "completed",
          paymentMethod: "card",
          amount: 55,
        },
        {
          id: "apt-17",
          date: getPastDate(55),
          time: "09:00",
          reason: "Consulta nutricional",
          status: "completed",
          paymentMethod: "cash",
          amount: 60,
        },
      ],
    },
    {
      id: "sofia-ramirez",
      name: "Sofía Ramírez",
      phone: "+593 99 789 0123",
      email: "sofia.ramirez@email.com",
      appointments: [
        {
          id: "apt-18",
          date: getPastDate(6),
          time: "10:30",
          reason: "Consulta de rutina y chequeo general",
          status: "completed",
          paymentMethod: "cash",
          amount: 45,
        },
        {
          id: "apt-19",
          date: getPastDate(40),
          time: "14:30",
          reason: "Consulta pediátrica",
          status: "completed",
          paymentMethod: "card",
          amount: 50,
        },
      ],
    },
    {
      id: "roberto-fernandez",
      name: "Roberto Fernández",
      phone: "+593 99 890 1234",
      email: "roberto.fernandez@email.com",
      appointments: [
        {
          id: "apt-20",
          date: getPastDate(8),
          time: "08:30",
          reason: "Consulta dermatológica",
          status: "completed",
          paymentMethod: "card",
          amount: 65,
        },
        {
          id: "apt-21",
          date: getPastDate(32),
          time: "10:00",
          reason: "Revisión de lunares",
          status: "completed",
          paymentMethod: "card",
          amount: 65,
        },
        {
          id: "apt-22",
          date: getPastDate(70),
          time: "15:00",
          reason: "Consulta por acné",
          status: "completed",
          paymentMethod: "cash",
          amount: 60,
        },
      ],
    },
    {
      id: "carmen-torres",
      name: "Carmen Torres",
      phone: "+593 99 901 2345",
      email: "carmen.torres@email.com",
      appointments: [
        {
          id: "apt-23",
          date: getPastDate(10),
          time: "10:00",
          reason: "Control prenatal",
          status: "completed",
          paymentMethod: "card",
          amount: 70,
        },
        {
          id: "apt-24",
          date: getPastDate(38),
          time: "09:00",
          reason: "Ecografía obstétrica",
          status: "completed",
          paymentMethod: "card",
          amount: 80,
        },
        {
          id: "apt-25",
          date: getPastDate(65),
          time: "11:00",
          reason: "Primera consulta prenatal",
          status: "completed",
          paymentMethod: "card",
          amount: 70,
        },
      ],
    },
    {
      id: "diego-morales",
      name: "Diego Morales",
      phone: "+593 98 123 4567",
      email: "diego.morales@email.com",
      appointments: [
        {
          id: "apt-26",
          date: getPastDate(12),
          time: "13:00",
          reason: "Consulta por alergias estacionales",
          status: "completed",
          paymentMethod: "cash",
          amount: 45,
        },
        {
          id: "apt-27",
          date: getPastDate(42),
          time: "14:00",
          reason: "Control de asma",
          status: "completed",
          paymentMethod: "card",
          amount: 55,
        },
      ],
    },
    {
      id: "isabella-cruz",
      name: "Isabella Cruz",
      phone: "+593 98 234 5678",
      email: "isabella.cruz@email.com",
      appointments: [
        {
          id: "apt-28",
          date: getPastDate(15),
          time: "09:00",
          reason: "Consulta psicológica",
          status: "completed",
          paymentMethod: "card",
          amount: 80,
        },
        {
          id: "apt-29",
          date: getPastDate(48),
          time: "10:00",
          reason: "Seguimiento terapia",
          status: "completed",
          paymentMethod: "card",
          amount: 80,
        },
        {
          id: "apt-30",
          date: getPastDate(75),
          time: "11:00",
          reason: "Primera sesión",
          status: "completed",
          paymentMethod: "card",
          amount: 80,
        },
      ],
    },
    {
      id: "andres-vargas",
      name: "Andrés Vargas",
      phone: "+593 98 345 6789",
      email: "andres.vargas@email.com",
      appointments: [
        {
          id: "apt-31",
          date: getPastDate(18),
          time: "11:00",
          reason: "Control cardiológico",
          status: "completed",
          paymentMethod: "card",
          amount: 90,
        },
        {
          id: "apt-32",
          date: getPastDate(52),
          time: "09:30",
          reason: "Electrocardiograma",
          status: "completed",
          paymentMethod: "card",
          amount: 95,
        },
      ],
    },
    {
      id: "valentina-herrera",
      name: "Valentina Herrera",
      phone: "+593 98 456 7890",
      email: "valentina.herrera@email.com",
      appointments: [
        {
          id: "apt-33",
          date: getPastDate(22),
          time: "15:00",
          reason: "Consulta pediátrica",
          status: "completed",
          paymentMethod: "cash",
          amount: 50,
        },
        {
          id: "apt-34",
          date: getPastDate(58),
          time: "10:00",
          reason: "Vacunación",
          status: "completed",
          paymentMethod: "card",
          amount: 45,
        },
        {
          id: "apt-35",
          date: getPastDate(85),
          time: "14:00",
          reason: "Control de crecimiento",
          status: "completed",
          paymentMethod: "cash",
          amount: 50,
        },
      ],
    },
  ];
};

export const getPatientsMock = (): Patient[] => {
  // Intentar leer citas desde localStorage
  const savedAppointments = localStorage.getItem("doctor_appointments");
  let appointments: DoctorAppointment[];
  
  if (savedAppointments) {
    appointments = JSON.parse(savedAppointments);
  } else {
    appointments = generateMockAppointments();
  }
  
  // Generar pacientes desde citas
  const patientsFromAppointments = generatePatientsFromAppointments(appointments);
  
  // Agregar pacientes mock adicionales
  const additionalPatients = getAdditionalPatientsMock();
  
  // Combinar y eliminar duplicados (por ID)
  const patientMap = new Map<string, Patient>();
  
  // Primero agregar los de las citas
  patientsFromAppointments.forEach((patient) => {
    patientMap.set(patient.id, patient);
  });
  
  // Luego agregar los adicionales (si no existen ya)
  additionalPatients.forEach((patient) => {
    if (!patientMap.has(patient.id)) {
      patientMap.set(patient.id, patient);
    } else {
      // Si existe, combinar los historiales de citas
      const existing = patientMap.get(patient.id)!;
      existing.appointments.push(...patient.appointments);
      // Ordenar por fecha (más reciente primero)
      existing.appointments.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
    }
  });
  
  return Array.from(patientMap.values());
};

