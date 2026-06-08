import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuthStore } from '../../../app/store/auth.store';
import type { ClinicProfile } from '../types/clinic.entity';

interface ClinicContextType {
  clinic: ClinicProfile | null;
  clinicId: string | null;
  isLoading: boolean;
  setClinic: (clinic: ClinicProfile) => void;
  refreshClinic: () => Promise<void>;
}

const ClinicContext = createContext<ClinicContextType>({
  clinic: null,
  clinicId: null,
  isLoading: false,
  setClinic: () => {},
  refreshClinic: async () => {},
});

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const [clinic, setClinic] = useState<ClinicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clinicId = clinic?.id || user?.id || null;

  const refreshClinic = useCallback(async () => {
    setIsLoading(true);
    try {
      // const profile = await getClinicProfileAPI();
      // setClinic(profile);
    } catch {
      // handled silently
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ClinicContext.Provider value={{ clinic, clinicId, isLoading, setClinic, refreshClinic }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinicContext = () => useContext(ClinicContext);
