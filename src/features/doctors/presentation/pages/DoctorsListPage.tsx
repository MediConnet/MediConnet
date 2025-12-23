import { ArrowBack, MedicalServicesOutlined, Search } from '@mui/icons-material'; // Importamos icono para el estado vacío
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_SPECIALTIES } from '../../../search/infrastructure/specialties.mock';
import { DoctorCard } from '../components/DoctorCard';
import { useDoctorsBySpecialty } from '../hooks/useDoctorsBySpecialty';

export const DoctorsListPage = () => {
  const { specialtyName } = useParams<{ specialtyName: string }>();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");

  const { data: doctors, isLoading } = useDoctorsBySpecialty(specialtyName);

  const specialtyInfo = MOCK_SPECIALTIES.find(
    s => s.name.toLowerCase() === specialtyName?.toLowerCase()
  );

  const filteredDoctors = doctors?.filter(doctor => {
    const query = searchQuery.toLowerCase();
    
    return doctor.name.toLowerCase().split(" ").some(word => word.startsWith(query));
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0fdfa] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* --- Encabezado y Navegación --- */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium cursor-pointer"
        >
          <ArrowBack className="mr-1" fontSize="small" />
          Volver a Especialidades
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${specialtyInfo?.colorClass || 'bg-blue-500'} text-white`}>
              {specialtyInfo?.icon || '👨‍⚕️'}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 capitalize">
                {specialtyName}
              </h1>
              <p className="text-gray-500 mt-1">
                {filteredDoctors?.length || 0} médicos encontrados
              </p>
            </div>
          </div>
        </div>

        {/* --- Barra de Búsqueda --- */}
        <div className="relative mb-10 max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
            placeholder="Buscar por nombre o dirección..."
          />
        </div>

        {/* --- Lógica de Renderizado del Grid --- */}
        
        {!doctors || doctors.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
             <p className="text-gray-500 text-lg">No existen médicos registrados en esta especialidad.</p>
           </div>
        
        ) : filteredDoctors?.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[300px]">
            <MedicalServicesOutlined sx={{ fontSize: 80 }} className="text-gray-300 mb-4" />
            <h3 className="text-gray-400 text-lg font-medium">
              No se encontraron médicos con ese criterio de búsqueda
            </h3>
          </div>

        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredDoctors?.map((doctor) => (
              <DoctorCard 
                key={doctor.id} 
                doctor={doctor} 
                onViewProfile={(id) => navigate(`/doctor/${id}`)}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};