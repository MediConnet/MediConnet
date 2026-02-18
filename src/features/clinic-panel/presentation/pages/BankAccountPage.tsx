import { Box, Snackbar, Alert } from '@mui/material';
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
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

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
      
      setSnackbar({
        open: true,
        message: 'Cuenta bancaria actualizada correctamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al actualizar cuenta bancaria:', error);
      setSnackbar({
        open: true,
        message: 'Error al actualizar la cuenta bancaria. Intenta nuevamente.',
        severity: 'error'
      });
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

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
