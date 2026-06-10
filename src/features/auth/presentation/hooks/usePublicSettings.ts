import { useQuery } from '@tanstack/react-query';
import { getPublicSettingsAPI } from '../../infrastructure/auth.api';
import type { PublicSettings } from '../../infrastructure/auth.api';

export const usePublicSettings = () => {
  return useQuery<PublicSettings>({
    queryKey: ['publicSettings'],
    queryFn: getPublicSettingsAPI,
    staleTime: 5 * 60 * 1000, // 5 minutos - configuración general
  });
};
