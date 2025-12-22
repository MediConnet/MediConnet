import { useNavigate } from 'react-router-dom';
import { SpecialtyCard } from '../components/SpecialtyCard';
import { useSpecialties } from '../hooks/useSpecialties';

export const SpecialtiesPage = () => {
  const navigate = useNavigate();
  const { data: specialties, isLoading } = useSpecialties();

  const handleSelectSpecialty = (id: string) => {
    // Aquí redirigimos a la búsqueda filtrada por esa especialidad (lo haremos funcionar luego)
    console.log(`Especialidad seleccionada: ${id}`);
    // navigate(/search?specialty=${id}); // Ejemplo futuro
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Encabezado */}
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
           <span className="text-2xl text-white">🩺</span>
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Médicos</h1>
            <p className="text-gray-500">Selecciona la especialidad que necesitas</p>
        </div>
      </div>

      {/* Estado de Carga */}
      {isLoading && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg animate-pulse">Cargando especialidades...</p>
        </div>
      )}

      {/* Grid de Especialidades */}
      {specialties && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {specialties.map((specialty) => (
            <SpecialtyCard 
              key={specialty.id} 
              specialty={specialty} 
              onClick={handleSelectSpecialty}
            />
          ))}
        </div>
      )}
    </div>
  );
};