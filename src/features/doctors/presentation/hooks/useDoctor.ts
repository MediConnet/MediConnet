import { useQuery } from '@tanstack/react-query';
import { getDoctorUseCase } from '../../application/get-doctor.usecase';
import { Doctor } from '../../domain/Doctor.entity';

export const useDoctor = (doctorId: string) => {
  return useQuery<Doctor>({
    queryKey: ['doctor', doctorId],
    queryFn: () => getDoctorUseCase(doctorId),
    enabled: !!doctorId,
  });
};





