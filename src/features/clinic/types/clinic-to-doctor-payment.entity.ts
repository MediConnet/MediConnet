export interface ClinicToDoctorPayment {
  id: string;
  clinicId: string;
  clinicName: string;
  doctorId: string;
  doctorName: string;
  amount: number;
  status: 'pending' | 'paid';
  paymentDate: string | null;
  createdAt: string;
  clinicPaymentId: string;
  doctorBankAccount?: {
    bankName: string;
    accountNumber: string;
    accountType: 'checking' | 'savings';
    accountHolder: string;
  };
}
