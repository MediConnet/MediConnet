import type { Payment } from "../domain/Payment.entity";
import { generateMockAppointments } from "../infrastructure/appointments.mock";

const COMMISSION_RATE = 0.15; // 15% de comisión

export const getPaymentsMock = (): Payment[] => {
  const appointments = generateMockAppointments();
  
  // Solo incluir citas pagadas con tarjeta
  return appointments
    .filter((apt) => apt.status === "completed" && apt.paymentMethod === "card")
    .map((apt, index) => {
      const amount = apt.price || 50;
      const commission = amount * COMMISSION_RATE;
      const netAmount = amount - commission;

      return {
        id: `payment-${apt.id}`,
        appointmentId: apt.id,
        patientName: apt.patientName,
        date: apt.date,
        amount,
        commission,
        netAmount,
        status: index % 3 === 0 ? "pending" : "paid", // Algunos pendientes, otros pagados
        paymentMethod: "card" as const,
        createdAt: apt.date,
      };
    });
};

