export interface PaymentDistribution {
  clinicPaymentId: string;
  totalReceived: number;
  distributions: DoctorDistribution[];
  totalDistributed: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorDistribution {
  doctorId: string;
  doctorName: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid';
  paymentId?: string;
}
