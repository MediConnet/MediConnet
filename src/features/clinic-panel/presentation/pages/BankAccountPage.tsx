import { Box, CircularProgress } from '@mui/material';
import { BankAccountSection } from '../components/BankAccountSection';
import type { BankAccount } from '../../domain/clinic.entity';
import { useClinicProfile, useUpdateClinicProfile } from '../hooks/useClinicProfile';

interface BankAccountPageProps {
  clinicId: string;
}

export const BankAccountPage = ({ clinicId }: BankAccountPageProps) => {
  const { profile, loading: loadingProfile } = useClinicProfile();
  const { mutateAsync: updateProfile } = useUpdateClinicProfile();

  const bankAccount = profile?.bankAccount;

  const handleUpdateBankAccount = async (newBankAccount: BankAccount) => {
    await updateProfile({ bankAccount: newBankAccount });
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
    </Box>
  );
};
