import { Box, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { BankAccountSection } from '../components/BankAccountSection';
import type { BankAccount } from '../../domain/clinic.entity';
import { useClinicProfile, useUpdateClinicProfile } from '../hooks/useClinicProfile';

interface BankAccountPageProps {
  clinicId: string;
}

export const BankAccountPage = ({ clinicId }: BankAccountPageProps) => {
  const { profile, loading: loadingProfile } = useClinicProfile();
  const { mutateAsync: updateProfile } = useUpdateClinicProfile();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const bankAccount = profile?.bankAccount;

  const handleUpdateBankAccount = async (newBankAccount: BankAccount) => {
    try {
      await updateProfile({ bankAccount: newBankAccount });
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

  if (loadingProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
