export type PaymentSource = 'admin' | 'clinic';

export interface Payment {
  id: string;
  appointmentId: string;
  patientName: string;
  date: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: "pending" | "paid";
  paymentMethod: "card" | "cash";
  createdAt: string;

  source: PaymentSource;
  clinicId?: string;
  clinicName?: string;
}
