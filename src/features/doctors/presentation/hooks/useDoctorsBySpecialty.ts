import { useQuery } from '@tanstack/react-query';
import { getDoctorsBySpecialtyUseCase } from '../../application/get-doctors-by-specialty.usecase';
import { Doctor } from '../../domain/Doctor.entity';

export const useDoctorsBySpecialty = (specialtyName: string | undefined) => {
  return useQuery<Doctor[], Error>({
    queryKey: ['doctors-by-specialty', specialtyName],
    
    queryFn: () => {
      if (!specialtyName) throw new Error("Especialidad no especificada");
      return getDoctorsBySpecialtyUseCase(specialtyName);
    },
    
    enabled: !!specialtyName, 
  });
};