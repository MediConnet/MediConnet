/**
 * Entidad: Pago del Administrador a la Clínica
 * Representa los pagos que la clínica recibe del administrador
 */
export interface ClinicPayment {
  id: string;
  clinicId: string;
  clinicName: string;
  totalAmount: number;        // Total de citas pagadas con tarjeta
  appCommission: number;      // Comisión de la app (15%)
  netAmount: number;          // Total neto para la clínica (totalAmount - appCommission)
  status: 'pending' | 'paid';
  paymentDate: string | null;
  createdAt: string;
  
  // Detalle de citas incluidas en este pago
  appointments: {
    id: string;
    doctorId: string;
    doctorName: string;
    patientName: string;
    amount: number;
    date: string;
  }[];
  
  // Información de distribución
  isDistributed: boolean;
  distributedAmount: number;  // Monto ya distribuido a médicos
  remainingAmount: number;    // Monto sin distribuir
}
