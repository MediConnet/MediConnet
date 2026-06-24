import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import { AccountBalance, Info, Edit, CheckCircle, Warning } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { getDoctorBankAccountAPI, updateDoctorBankAccountAPI, type BankAccountData } from '../api/payments.api';
import { BankAccountModal } from '../../../shared/components/BankAccountModal';
import { useFeedbackStore } from '../../../app/store/feedback.store';
import { useAuthStore } from '../../../app/store/auth.store';

export const DoctorBankAccountSection = () => {
  const [bankAccount, setBankAccount] = useState<BankAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const feedback = useFeedbackStore();
  const { user } = useAuthStore();

  useEffect(() => {
    getDoctorBankAccountAPI()
      .then((data) => setBankAccount(data))
      .catch(() => {
        setFetchError('No fue posible cargar los datos de tu cuenta bancaria.');
        setBankAccount(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (values: any) => {
    setSaving(true);
    try {
      const updated = await updateDoctorBankAccountAPI(values);
      setBankAccount(updated);
      setDialogOpen(false);
      feedback.showFeedback('success', 'Cambios guardados', 'Tu cuenta bancaria fue actualizada correctamente.');
    } catch {
      feedback.showFeedback('error', 'Error', 'No fue posible completar la operación. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AccountBalance sx={{ fontSize: 32, color: '#14b8a6' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Mi Cuenta Bancaria</Typography>
          <Typography variant="body2" color="text.secondary">Datos para recibir pagos</Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={bankAccount ? <Edit /> : <AccountBalance />}
          onClick={() => setDialogOpen(true)}
          sx={{ borderColor: '#14b8a6', color: '#14b8a6', '&:hover': { borderColor: '#0d9488', color: '#0d9488' } }}
        >
          {bankAccount ? 'Editar' : 'Agregar'}
        </Button>
      </Box>

      {fetchError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setFetchError(null)}>
          {fetchError}
        </Alert>
      )}

      <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600}>Información Importante</Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Estos datos bancarios serán utilizados para realizar los depósitos de tus pagos.
          Asegúrate de que la información sea correcta y esté actualizada.
        </Typography>
      </Alert>

      {!bankAccount ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <AccountBalance sx={{ fontSize: 64, color: '#e5e7eb', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No tienes una cuenta bancaria registrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Agrega tus datos bancarios para recibir pagos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AccountBalance />}
              onClick={() => setDialogOpen(true)}
              sx={{ backgroundColor: '#14b8a6', '&:hover': { backgroundColor: '#0d9488' } }}
            >
              Agregar Cuenta Bancaria
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card elevation={0} sx={{ border: '2px solid #d1fae5', bgcolor: '#f0fdfa' }}>
          <CardContent>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <CheckCircle sx={{ color: '#10b981' }} />
              <Typography variant="subtitle1" fontWeight={700} color="#10b981">
                Cuenta Bancaria Configurada
              </Typography>
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Banco</Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>{bankAccount.bankName}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Tipo de Cuenta</Typography>
                <div>
                  <Chip
                    label={bankAccount.accountType === 'checking' ? 'Corriente' : 'Ahorros'}
                    size="small"
                    sx={{ mt: 0.5, bgcolor: '#14b8a6', color: 'white' }}
                  />
                </div>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Número de Cuenta</Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600, fontFamily: 'monospace' }}>
                  {bankAccount.accountNumber}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Titular de la Cuenta</Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>{bankAccount.accountHolder}</Typography>
              </Box>

              {bankAccount.identificationNumber && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>RUC / Cédula</Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>{bankAccount.identificationNumber}</Typography>
                </Box>
              )}

              {bankAccount.email && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>Correo Electrónico</Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>{bankAccount.email}</Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      <Alert severity="warning" sx={{ mt: 3 }} icon={<Warning />}>
        <Typography variant="body2" fontWeight={600}>Mantén tus datos actualizados</Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Si cambias de cuenta bancaria, actualiza estos datos inmediatamente para evitar retrasos en tus pagos.
        </Typography>
      </Alert>

      <BankAccountModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bankAccount={bankAccount}
        onSave={handleSave}
        loading={saving}
        defaultEmail={user?.email}
      />
    </Box>
  );
};
