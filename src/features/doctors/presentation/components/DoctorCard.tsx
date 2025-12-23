import {
  Star,
  Visibility,
  WorkHistory
} from '@mui/icons-material';
import { type Doctor } from '../../domain/Doctor.entity';

interface DoctorCardProps {
  doctor: Doctor;
  onViewProfile: (doctorId: string) => void;
}

export const DoctorCard = ({ doctor, onViewProfile }: DoctorCardProps) => {
  const placeholderImage = `https://i.pravatar.cc/300?u=${doctor.id}`;

  return (
    <div 
      onClick={() => onViewProfile(doctor.id)}
      className="
        bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden 
        flex flex-col h-full
        cursor-pointer 
        transition-all duration-300 
        hover:shadow-xl hover:scale-[1.03]
      "
    >
      {/* Imagen del Doctor */}
      <div className="h-48 overflow-hidden bg-gray-100 relative">
        <img 
          src={placeholderImage} 
          alt={doctor.name}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-5 flex flex-col flex-grow">
        
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {doctor.name}
        </h3>

        <div className="mb-4">
          <span className="
            inline-block px-3 py-1 
            bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 
            text-xs font-bold rounded-lg
          ">
            {doctor.specialty}
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-2">
          <WorkHistory sx={{ fontSize: 18 }} className="mr-2 text-gray-400" />
          <span>{doctor.experience?.[0] || 'Experiencia no especificada'}</span>
        </div>

        <div className="flex items-center text-sm mb-4">
          <Star sx={{ fontSize: 18 }} className="text-yellow-400 mr-1" />
          <span className="font-bold text-gray-900 mr-1">{doctor.rating.toFixed(1)}</span>
          <span className="text-gray-400">({doctor.totalReviews} reseñas)</span>
        </div>

        <div className="flex-grow"></div>

        <button
          className="
            w-full mt-2 
            bg-[#06B6D4] hover:bg-[#0891b2] 
            text-white font-medium py-2.5 px-4 rounded-xl 
            transition-colors flex items-center justify-center gap-2 pointer-events-none
          "
        >
          <Visibility sx={{ fontSize: 20 }} />
          Ver Médico
        </button>
      </div>
    </div>
  );
};