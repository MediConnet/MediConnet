import type { Payment } from "../types/Payment.entity";

const COMMISSION_RATE = 0.15;

const getPastDate = (daysAgo: number) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysAgo);
  return pastDate.toISOString().split("T")[0];
};

const generateLocalPaymentData = () => [
  {
    id: "apt-mock-1",
    patientName: "María García",
    date: getPastDate(2),
    price: 50,
    status: "completed",
    paymentMethod: "card",
  },
  {
    id: "apt-mock-2",
    patientName: "Juan López",
    date: getPastDate(3),
    price: 45,
    status: "completed",
    paymentMethod: "cash",
  },
  {
    id: "apt-mock-3",
    patientName: "Ana Martínez",
    date: getPastDate(5),
    price: 40,
    status: "completed",
    paymentMethod: "card",
  },
  {
    id: "apt-mock-4",
    patientName: "Carlos Rodríguez",
    date: getPastDate(1),
    price: 60,
    status: "paid",
    paymentMethod: "card",
  }
];

export const getPaymentsMock = (doctorName?: string): Payment[] => {
  const sourceData = generateLocalPaymentData();

  const paymentsFromAppointments: Payment[] = sourceData
    .filter((apt) => (apt.status === "paid" || apt.status === "completed") && apt.paymentMethod === "card")
    .map((apt, index) => {
      const amount = apt.price || 50;
      const commission = amount * COMMISSION_RATE;
      const netAmount = amount - commission;

      const statusValue = index % 3 === 0 ? "pending" : "paid";

      return {
        id: `payment-${apt.id}`,
        appointmentId: apt.id,
        patientName: apt.patientName,
        date: apt.date,
        amount,
        commission,
        netAmount,
        status: statusValue as "paid" | "pending",
        paymentMethod: "card" as const,
        createdAt: apt.date,
      };
    });

  const additionalPayments: Payment[] = doctorName && doctorName !== "Dr. Juan Pérez" ? [] : [
    {
      id: "payment-extra-1",
      appointmentId: "apt-extra-1",
      patientName: "Luisa Fernández",
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
      patientName: "Roberto Gomez",
      date: getPastDate(10),
      amount: 40,
      commission: 6,
      netAmount: 34,
      status: "paid",
      paymentMethod: "card",
      createdAt: getPastDate(10),
    },
    {
      id: "payment-extra-4",
      appointmentId: "apt-extra-4",
      patientName: "Patricia Silva",
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
