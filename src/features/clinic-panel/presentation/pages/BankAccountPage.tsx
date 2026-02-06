import { Box } from '@mui/material';
import { useState } from 'react';
import { BankAccountSection } from '../components/BankAccountSection';
import type { BankAccount } from '../../domain/clinic.entity';

interface BankAccountPageProps {
  clinicId: string;
}

export const BankAccountPage = ({ clinicId }: BankAccountPageProps) => {
  // Mock de cuenta bancaria (en producción vendría del backend)
  const [bankAccount, setBankAccount] = useState<BankAccount | undefined>({
    bankName: 'Banco Pichincha',
    accountNumber: '2100123456789',
    accountType: 'checking',
    accountHolder: 'Clínica Central S.A.',
    identificationNumber: '1792345678001',
  });

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
