export interface ClinicPayment {
  id: string;
  clinicId: string;
  clinicName: string;
  totalAmount: number;
  appCommission: number;
  netAmount: number;
  status: 'pending' | 'paid';
  paymentDate: string | null;
  createdAt: string;
  appointments: {
    id: string;
    doctorId: string;
    doctorName: string;
    patientName: string;
    amount: number;
    date: string;
  }[];
  isDistributed: boolean;
  distributedAmount: number;
  remainingAmount: number;
}
