import { httpClient } from '../../../shared/lib/http';
import { Booking } from '../domain/Booking.entity';
import { ConfirmBookingDTO } from '../application/confirm-booking.usecase';

export const confirmBookingAPI = async (
  data: ConfirmBookingDTO
): Promise<Booking> => {
  const response = await httpClient.post<Booking>('/bookings', data);
  return response.data;
};

export const getBookingAPI = async (bookingId: string): Promise<Booking> => {
  const response = await httpClient.get<Booking>(`/bookings/${bookingId}`);
  return response.data;
};

export const cancelBookingAPI = async (bookingId: string): Promise<void> => {
  await httpClient.delete(`/bookings/${bookingId}`);
};





