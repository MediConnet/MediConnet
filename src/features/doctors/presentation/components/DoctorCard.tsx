import { Doctor } from '../../domain/Doctor.entity';
import { Button } from '../../../../shared/ui/Button';

interface DoctorCardProps {
  doctor: Doctor;
  onViewProfile: (doctorId: string) => void;
}

export const DoctorCard = ({ doctor, onViewProfile }: DoctorCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold">{doctor.name}</h3>
      <p className="text-gray-600">{doctor.specialty}</p>
      <div className="mt-2">
        <span className="text-yellow-500">★</span>
        <span className="ml-1">
          {doctor.rating.toFixed(1)} ({doctor.totalReviews} reseñas)
        </span>
      </div>
      {doctor.bio && (
        <p className="mt-4 text-sm text-gray-700">{doctor.bio}</p>
      )}
      <Button
        variant="primary"
        className="mt-4"
        onClick={() => onViewProfile(doctor.id)}
      >
        Ver perfil
      </Button>
    </div>
  );
};





