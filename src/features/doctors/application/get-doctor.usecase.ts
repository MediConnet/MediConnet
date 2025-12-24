import type { Doctor } from '../domain/Doctor.entity';
import { MOCK_DOCTORS } from '../infrastructure/doctors.mock';

export const getDoctorUseCase = async (doctorId: string): Promise<Doctor> => {
  // Simulamos búsqueda en base de datos local
  const doctor = MOCK_DOCTORS.find(d => d.id === doctorId);
  
  if (!doctor) {
    throw new Error('Doctor no encontrado');
  }

  return doctor;
};

