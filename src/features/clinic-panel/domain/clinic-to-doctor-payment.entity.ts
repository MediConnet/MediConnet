/**
 * Entidad: Pago de la Clínica a un Médico
 * Representa los pagos que la clínica realiza a sus médicos asociados
 */
export interface ClinicToDoctorPayment {
  id: string;
  clinicId: string;
  clinicName: string;
  doctorId: string;
  doctorName: string;
  amount: number;             // Monto asignado al médico
  status: 'pending' | 'paid';
  paymentDate: string | null;
  createdAt: string;
  
  // Referencia al pago de admin a clínica
  clinicPaymentId: string;
  
  // Información bancaria del médico (para referencia)
  doctorBankAccount?: {
    bankName: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
    accountHolder: string;
  };
}
