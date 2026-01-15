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

export const getPaymentsMock = (): Payment[] => {
  const appointments = generateMockAppointments();
  
  // Pagos desde citas existentes (solo las pagadas con tarjeta)
  const paymentsFromAppointments = appointments
    .filter((apt) => (apt.status === "paid" || apt.status === "completed") && apt.paymentMethod === "card")
    .map((apt, index) => {
      const amount = apt.price || 50;
      const commission = amount * COMMISSION_RATE;
      const netAmount = amount - commission;

      return {
        id: `payment-${apt.id}`,
        appointmentId: apt.id,
        patientName: DOCTORS[index % DOCTORS.length], // Asignar doctor rotativo
        date: apt.date,
        amount,
        commission,
        netAmount,
        status: index % 3 === 0 ? "pending" : "paid",
        paymentMethod: "card" as const,
        createdAt: apt.date,
      };
    });

  // Agregar más pagos mock adicionales para tener más datos
  const additionalPayments: Payment[] = [
    {
      id: "payment-extra-1",
      appointmentId: "apt-extra-1",
      patientName: "Dr. Roberto Sánchez",
      date: getPastDate(5),
      amount: 60,
      commission: 9,
      netAmount: 51,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(5),
    },
    {
      id: "payment-extra-2",
      appointmentId: "apt-extra-2",
      patientName: "Dr. Roberto Sánchez",
      date: getPastDate(3),
      amount: 55,
      commission: 8.25,
      netAmount: 46.75,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(3),
    },
    {
      id: "payment-extra-3",
      appointmentId: "apt-extra-3",
      patientName: "Dr. María González",
      date: getPastDate(7),
      amount: 70,
      commission: 10.5,
      netAmount: 59.5,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(7),
    },
    {
      id: "payment-extra-4",
      appointmentId: "apt-extra-4",
      patientName: "Dr. María González",
      date: getPastDate(2),
      amount: 65,
      commission: 9.75,
      netAmount: 55.25,
      status: "pending",
      paymentMethod: "card",
      createdAt: getPastDate(2),
    },
    {
      id: "payment-extra-5",
      appointmentId: "apt-extra-5",
      patientName: "Dr. Carlos Mendoza",
      date: getPastDate(10),
      amount: 80,
      commission: 12,
      netAmount: 68,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(10),
    },
    {
      id: "payment-extra-6",
      appointmentId: "apt-extra-6",
      patientName: "Dr. Carlos Mendoza",
      date: getPastDate(1),
      amount: 75,
      commission: 11.25,
      netAmount: 63.75,
      status: "pending",
      paymentMethod: "card",
      createdAt: getPastDate(1),
    },
    {
      id: "payment-extra-7",
      appointmentId: "apt-extra-7",
      patientName: "Dra. Ana Martínez",
      date: getPastDate(6),
      amount: 50,
      commission: 7.5,
      netAmount: 42.5,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(6),
    },
    {
      id: "payment-extra-8",
      appointmentId: "apt-extra-8",
      patientName: "Dra. Ana Martínez",
      date: getPastDate(4),
      amount: 45,
      commission: 6.75,
      netAmount: 38.25,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(4),
    },
    {
      id: "payment-extra-9",
      appointmentId: "apt-extra-9",
      patientName: "Dr. Juan Pérez",
      date: getPastDate(8),
      amount: 90,
      commission: 13.5,
      netAmount: 76.5,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(8),
    },
    {
      id: "payment-extra-10",
      appointmentId: "apt-extra-10",
      patientName: "Dr. Juan Pérez",
      date: getPastDate(0),
      amount: 85,
      commission: 12.75,
      netAmount: 72.25,
      status: "pending",
      paymentMethod: "card",
      createdAt: getPastDate(0),
    },
  ];

  return [...paymentsFromAppointments, ...additionalPayments];
};

