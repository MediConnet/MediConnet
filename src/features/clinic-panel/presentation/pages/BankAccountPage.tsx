import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { BankAccountSection } from '../components/BankAccountSection';
import type { BankAccount } from '../../domain/clinic.entity';

interface BankAccountPageProps {
  clinicId: string;
}

export const BankAccountPage = ({ clinicId }: BankAccountPageProps) => {
  // Inicia vacío: si es una clínica nueva, no debe mostrar datos precargados.
  // Si existen datos guardados (mock), se cargan desde localStorage.
  const [bankAccount, setBankAccount] = useState<BankAccount | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`clinic_bank_account_${clinicId}`);
      if (saved) {
        setBankAccount(JSON.parse(saved) as BankAccount);
      } else {
        setBankAccount(undefined);
      }
    } catch {
      setBankAccount(undefined);
    }
  }, [clinicId]);

  const handleUpdateBankAccount = async (newBankAccount: BankAccount) => {
    try {
      // Aquí llamarías a la API para actualizar la cuenta bancaria
      // await updateClinicBankAccountAPI(clinicId, newBankAccount);
      
      // Por ahora solo actualizamos el estado local
      setBankAccount(newBankAccount);
      
      // Guardar en localStorage para persistencia
      localStorage.setItem(`clinic_bank_account_${clinicId}`, JSON.stringify(newBankAccount));
      
      alert('Cuenta bancaria actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar cuenta bancaria:', error);
      throw error;
    }
  };

  return (
    <Box>
      <BankAccountSection
        clinicId={clinicId}
        bankAccount={bankAccount}
        onUpdate={handleUpdateBankAccount}
      />
    </Box>
  );
};
