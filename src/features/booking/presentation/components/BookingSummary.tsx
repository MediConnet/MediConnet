import type { Booking } from '../../domain/Booking.entity';
import { formatMoney } from '../../../../shared/lib/formatMoney';
import { formatDate, formatTime } from '../../../../shared/lib/formatDate';

interface BookingSummaryProps {
  booking: Booking;
}

export const BookingSummary = ({ booking }: BookingSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Resumen de Reserva</h2>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Fecha:</span>
          <span>{formatDate(booking.date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Hora:</span>
          <span>{formatTime(booking.date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Estado:</span>
          <span className="capitalize">{booking.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pago:</span>
          <span className="capitalize">{booking.paymentStatus}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{formatMoney(booking.amount, booking.currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};





