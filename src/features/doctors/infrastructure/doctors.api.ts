import { httpClient } from '../../../shared/lib/http';
import type { Doctor } from '../domain/Doctor.entity';
import type { Availability } from '../domain/Availability.entity';
import type { BookingRequest, BookingResponse } from '../application/book-doctor.usecase';

export const getDoctorAPI = async (doctorId: string): Promise<Doctor> => {
  const response = await httpClient.get<Doctor>(`/doctors/${doctorId}`);
  return response.data;
};

export const getDoctorAvailabilityAPI = async (
  doctorId: string,
  startDate: string,
  endDate: string
): Promise<Availability[]> => {
  const response = await httpClient.get<Availability[]>(
    `/doctors/${doctorId}/availability`,
    {
      params: { startDate, endDate },
    }
  );
  return response.data;
};

export const bookDoctorAPI = async (
  request: BookingRequest
): Promise<BookingResponse> => {
  const response = await httpClient.post<BookingResponse>(
    '/doctors/book',
    request
  );
  return response.data;
};





