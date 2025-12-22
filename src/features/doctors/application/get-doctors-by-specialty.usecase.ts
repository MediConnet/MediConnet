import { Doctor } from '../domain/Doctor.entity';
import { MOCK_DOCTORS } from '../infrastructure/doctors.mock';

export const getDoctorsBySpecialtyUseCase = async (specialtyName: string): Promise<Doctor[]> => {
  // Normalizamos el nombre para comparar (ej: "Cardiología" vs "cardiologia")
  const normalizedSpecialty = specialtyName.toLowerCase().trim();
  
  // Filtramos los mocks directamente
  const filteredDoctors = MOCK_DOCTORS.filter(doctor => 
    doctor.specialty.toLowerCase().trim() === normalizedSpecialty
  );

  return filteredDoctors;
};