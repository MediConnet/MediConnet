import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { confirmBookingUseCase, type ConfirmBookingDTO } from '../../application/confirm-booking.usecase';
import { BookingSummary } from '../components/BookingSummary';
import { Button } from '../../../../shared/ui/Button';
import type { Booking } from '../../domain/Booking.entity';

export const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const availabilityId = searchParams.get('availabilityId');
  const [patientNotes, setPatientNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const bookingMutation = useMutation({
    mutationFn: (data: ConfirmBookingDTO) => confirmBookingUseCase(data),
    onSuccess: (booking: Booking) => {
      // Redirigir a página de confirmación
      window.location.href = `/booking/confirmation/${booking.id}`;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctorId && availabilityId) {
      bookingMutation.mutate({
        doctorId,
        availabilityId,
        patientNotes,
        paymentMethod,
      });
    }
  };

  // Placeholder booking para el summary
  const placeholderBooking: Booking = {
    id: 'temp',
    doctorId: doctorId || '',
    patientId: '',
    availabilityId: availabilityId || '',
    date: new Date(),
    time: '',
    status: 'pending',
    paymentStatus: 'pending',
    amount: 100,
    currency: 'USD',
    createdAt: new Date(),
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Confirmar Reserva</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de pago
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="card">Tarjeta de crédito</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Efectivo</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas para el doctor (opcional)
              </label>
              <textarea
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <Button
              type="submit"
              isLoading={bookingMutation.isPending}
              disabled={!doctorId || !availabilityId}
            >
              Confirmar Reserva
            </Button>
          </form>
        </div>

        <div>
          <BookingSummary booking={placeholderBooking} />
        </div>
      </div>
    </div>
  );
};

