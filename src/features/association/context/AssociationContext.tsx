import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuthStore } from '../../../app/store/auth.store';
import { getClinicInfoAPI } from '../api/clinic-associated.api';

interface AssociationContextType {
  isClinicAssociated: boolean;
  clinicId: string | null;
  clinicName: string | null;
  isLoading: boolean;
  refreshAssociation: () => Promise<void>;
}

const AssociationContext = createContext<AssociationContextType>({
  isClinicAssociated: false,
  clinicId: null,
  clinicName: null,
  isLoading: false,
  refreshAssociation: async () => {},
});

export const AssociationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useAuthStore((s) => s.user);
  const [isClinicAssociated, setIsClinicAssociated] = useState(false);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [clinicName, setClinicName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAssociation = useCallback(async () => {
    if (!user || user.role !== 'provider') {
      setIsClinicAssociated(false);
      setClinicId(null);
      setClinicName(null);
      return;
    }

    setIsLoading(true);
    try {
      const info = await getClinicInfoAPI();
      if (info && info.id) {
        setIsClinicAssociated(true);
        setClinicId(info.id);
        setClinicName(info.name || null);
      } else {
        setIsClinicAssociated(false);
        setClinicId(null);
        setClinicName(null);
      }
    } catch {
      setIsClinicAssociated(false);
      setClinicId(null);
      setClinicName(null);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshAssociation();
    }
  }, [user, refreshAssociation]);

  return (
    <AssociationContext.Provider value={{ isClinicAssociated, clinicId, clinicName, isLoading, refreshAssociation }}>
      {children}
    </AssociationContext.Provider>
  );
};

export const useAssociationContext = () => useContext(AssociationContext);
