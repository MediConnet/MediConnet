import { Box } from '@mui/material';
import { DashboardLayout } from '../../../../shared/layouts/DashboardLayout';
import { SendEmailForm } from '../../../../shared/components/SendEmailForm';

const CURRENT_USER = {
  name: 'Usuario',
  roleLabel: 'Usuario',
  initials: 'U',
  isActive: true,
};

export const SendEmailPage = () => {
  const handleSuccess = () => {
    console.log('Correo enviado exitosamente');
  };

  const handleError = (error: string) => {
    console.error('Error al enviar correo:', error);
  };

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_USER}>
      <Box sx={{ p: 3 }}>
        <SendEmailForm onSuccess={handleSuccess} onError={handleError} />
      </Box>
    </DashboardLayout>
  );
};
