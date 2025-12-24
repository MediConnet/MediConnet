import { useQuery } from '@tanstack/react-query';
import { getSpecialtiesUseCase } from '../../application/get-specialties.usecase';
import type { Specialty } from '../../domain/specialty.entity';

export const useSpecialties = () => {
  return useQuery<Specialty[]>({
    queryKey: ['specialties'],
    queryFn: getSpecialtiesUseCase,
    staleTime: 1000 * 60 * 60, 
  });
};