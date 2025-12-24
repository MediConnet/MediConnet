import type { Specialty } from '../../domain/specialty.entity';

interface SpecialtyCardProps {
  specialty: Specialty;
  onClick: (id: string) => void;
}

export const SpecialtyCard = ({ specialty, onClick }: SpecialtyCardProps) => {
  return (
    <div 
      className="group cursor-pointer flex flex-col items-center text-center transition-transform hover:-translate-y-1"
      onClick={() => onClick(specialty.id)}
    >
      {/* Caja de color con el ícono */}
      <div className={`${specialty.colorClass} w-full aspect-[4/3] rounded-2xl flex items-center justify-center shadow-sm mb-4 transition-shadow group-hover:shadow-md`}>
        <span className="text-6xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300">
          {specialty.icon}
        </span>
      </div>

      {/* Título y enlace */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">
        {specialty.name}
      </h3>
      <span className="text-blue-500 text-sm font-medium group-hover:underline flex items-center">
        Ver médicos
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  );
};