/**
 * Entidad: Distribución de Pagos
 * Representa cómo se distribuye un pago de admin entre los médicos de la clínica
 */
export interface PaymentDistribution {
  clinicPaymentId: string;
  totalReceived: number;      // Total recibido del admin
  distributions: DoctorDistribution[];
  totalDistributed: number;   // Suma de todas las distribuciones
  remaining: number;          // Monto no distribuido (totalReceived - totalDistributed)
  createdAt: string;
  updatedAt: string;
}

export interface DoctorDistribution {
  doctorId: string;
  doctorName: string;
  amount: number;
  percentage: number;         // % del total recibido
  status: 'pending' | 'paid';
  paymentId?: string;         // ID del ClinicToDoctorPayment cuando se paga
}
