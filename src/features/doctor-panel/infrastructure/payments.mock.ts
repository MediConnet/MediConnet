import type { Payment } from "../domain/Payment.entity";
import { generateMockAppointments } from "../infrastructure/appointments.mock";

const COMMISSION_RATE = 0.15; // 15% de comisión

// Lista de doctores para asignar pagos
const DOCTORS = [
  "Dr. Roberto Sánchez",
  "Dr. María González",
  "Dr. Carlos Mendoza",
  "Dra. Ana Martínez",
  "Dr. Juan Pérez",
  "Dr. Pedro González",
];

// Función para obtener fecha futura
const getFutureDate = (daysFromToday: number) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysFromToday);
  return futureDate.toISOString().split("T")[0];
};

// Función para obtener fecha pasada reciente
const getPastDate = (daysAgo: number) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysAgo);
  return pastDate.toISOString().split("T")[0];
};

export const getPaymentsMock = (doctorName?: string): Payment[] => {
  const appointments = generateMockAppointments();
  
  // Pagos desde citas existentes (solo las pagadas con tarjeta)
  // NOTA: Estas citas ya pertenecen al doctor actual (Dr. Juan Pérez)
  const paymentsFromAppointments = appointments
    .filter((apt) => (apt.status === "paid" || apt.status === "completed") && apt.paymentMethod === "card")
    .map((apt, index) => {
      const amount = apt.price || 50;
      const commission = amount * COMMISSION_RATE;
      const netAmount = amount - commission;

      return {
        id: `payment-${apt.id}`,
        appointmentId: apt.id,
        patientName: apt.patientName, // Usar el nombre REAL del paciente de la cita
        date: apt.date,
        amount,
        commission,
        netAmount,
        status: index % 3 === 0 ? "pending" : "paid",
        paymentMethod: "card" as const,
        createdAt: apt.date,
      };
    });

  // Agregar más pagos mock adicionales para el doctor actual
  // Estos son pagos históricos del doctor (solo si es Dr. Juan Pérez o no se especifica doctor)
  const additionalPayments: Payment[] = doctorName && doctorName !== "Dr. Juan Pérez" ? [] : [
    {
      id: "payment-extra-1",
      appointmentId: "apt-extra-1",
      patientName: "María García",
      date: getPastDate(13),
      amount: 50,
      commission: 7.5,
      netAmount: 42.5,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(13),
    },
    {
      id: "payment-extra-2",
      appointmentId: "apt-extra-2",
      patientName: "Juan López",
      date: getPastDate(10),
      amount: 40,
      commission: 6,
      netAmount: 34,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(10),
    },
    {
      id: "payment-extra-3",
      appointmentId: "apt-extra-3",
      patientName: "Ana Martínez",
      date: getPastDate(8),
      amount: 55,
      commission: 8.25,
      netAmount: 46.75,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(8),
    },
    {
      id: "payment-extra-4",
      appointmentId: "apt-extra-4",
      patientName: "Carlos Rodríguez",
      date: getPastDate(5),
      amount: 75,
      commission: 11.25,
      netAmount: 63.75,
      status: "pending",
      paymentMethod: "card",
      createdAt: getPastDate(5),
    },
  ];

  return [...paymentsFromAppointments, ...additionalPayments];
};

