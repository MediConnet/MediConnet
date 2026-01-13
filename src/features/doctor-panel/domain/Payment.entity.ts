export interface Payment {
  id: string;
  appointmentId: string;
  patientName: string;
  date: string;
  amount: number; // Monto total cobrado
  commission: number; // Comisión de la app (ej: 15%)
  netAmount: number; // Total neto del médico (amount - commission)
  status: "pending" | "paid";
  paymentMethod: "card" | "cash";
  createdAt: string;
}

