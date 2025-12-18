import { useParams } from 'react-router-dom';
import { useDoctor } from '../hooks/useDoctor';
import { AvailabilityCalendar } from '../components/AvailabilityCalendar';
import { Availability } from '../../domain/Availability.entity';

export const DoctorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: doctor, isLoading } = useDoctor(id || '');

  const handleSelectAvailability = (availability: Availability) => {
    // Navegar a checkout
    window.location.href = `/checkout?doctorId=${doctor?.id}&availabilityId=${availability.id}`;
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!doctor) {
    return <div>Doctor no encontrado</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{doctor.name}</h1>
      <p className="text-xl text-gray-600 mb-4">{doctor.specialty}</p>
      
      <div className="mb-6">
        <span className="text-yellow-500">★</span>
        <span className="ml-1">
          {doctor.rating.toFixed(1)} ({doctor.totalReviews} reseñas)
        </span>
      </div>

      {doctor.bio && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Sobre el doctor</h2>
          <p className="text-gray-700">{doctor.bio}</p>
        </div>
      )}

      {/* Placeholder para disponibilidad */}
      <AvailabilityCalendar
        availabilities={[]}
        onSelect={handleSelectAvailability}
      />
    </div>
  );
};





