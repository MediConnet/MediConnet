import { confirmBookingAPI } from '../infrastructure/booking.api';
import { Booking } from '../domain/Booking.entity';

export interface ConfirmBookingDTO {
  doctorId: string;
  availabilityId: string;
  patientNotes?: string;
  paymentMethod: string;
}

export const confirmBookingUseCase = async (
  data: ConfirmBookingDTO
): Promise<Booking> => {
  return await confirmBookingAPI(data);
};

