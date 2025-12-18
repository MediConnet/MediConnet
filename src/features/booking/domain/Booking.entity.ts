/**
 * Entidad Booking
 */
export interface Booking {
  id: string;
  doctorId: string;
  patientId: string;
  availabilityId: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
  currency: string;
  patientNotes?: string;
  createdAt: Date;
}





