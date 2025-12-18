import { bookDoctorAPI } from '../infrastructure/doctors.api';

export interface BookingRequest {
  doctorId: string;
  availabilityId: string;
  patientNotes?: string;
}

export interface BookingResponse {
  bookingId: string;
  status: 'pending' | 'confirmed';
}

export const bookDoctorUseCase = async (
  request: BookingRequest
): Promise<BookingResponse> => {
  return await bookDoctorAPI(request);
};

