import { getDoctorAPI } from '../infrastructure/doctors.api';
import { Doctor } from '../domain/Doctor.entity';

export const getDoctorUseCase = async (doctorId: string): Promise<Doctor> => {
  return await getDoctorAPI(doctorId);
};

