import type { Doctor } from '../domain/Doctor.entity';
import { getDoctorAPI } from './doctors.api';

/**
 * Repository pattern para Doctor
 * Abstrae la lógica de acceso a datos
 */
export class DoctorRepository {
  async findById(id: string): Promise<Doctor> {
    return await getDoctorAPI(id);
  }

  async findAll(): Promise<Doctor[]> {
    // Implementar según necesidad
    throw new Error('Not implemented');
  }
}





