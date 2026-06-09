import {
  Box, Typography, Card, CardContent, Grid2, Alert,
  CircularProgress, Divider, Chip, Button, TextField, MenuItem,
} from '@mui/material';
import { AccountBalance, Info, Edit, Save, CheckCircle, Warning } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { getDoctorBankAccountAPI, updateDoctorBankAccountAPI, type BankAccountData } from '../api/payments.api';
import { ECUADOR_BANKS } from '../../../shared/config/domain.constants';
import { bankAccountValidationSchema } from '../../../shared/validation/bank-account.validation';
import { useFeedbackStore } from '../../../app/store/feedback.store';

export const DoctorBankAccountSection = () => {
  const [bankAccount, setBankAccount] = useState<BankAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const feedback = useFeedbackStore();

  useEffect(() => {
    getDoctorBankAccountAPI()
      .then((data) => setBankAccount(data))
      .catch((err) => {
        setFetchError('No fue posible cargar los datos de tu cuenta bancaria.');
        setBankAccount(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = () => {
    feedback.showConfirm(
      'Guardar datos bancarios',
      '¿Estás seguro de que deseas guardar esta información bancaria? Verifica que los datos sean correctos.',
      async () => {
        setSaving(true);
        try {
          const updated = await updateDoctorBankAccountAPI(formik.values);
          setBankAccount(updated);
          setIsEditing(false);
          feedback.showFeedback('success', 'Cambios guardados', 'Tu cuenta bancaria fue actualizada correctamente.');
        } catch {
          feedback.showFeedback('error', 'Error', 'No fue posible completar la operación. Intenta de nuevo.');
        } finally {
          setSaving(false);
        }
      },
      { confirmText: 'Guardar', cancelText: 'Cancelar' },
    );
  };

  const formik = useFormik({
    initialValues: {
      bankName: bankAccount?.bankName || '',
      accountNumber: bankAccount?.accountNumber || '',
      accountType: bankAccount?.accountType || 'checking',
      accountHolder: bankAccount?.accountHolder || '',
    },
    validationSchema: bankAccountValidationSchema,
    enableReinitialize: true,
    onSubmit: handleSave,
  });

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
        {bankAccount && !isEditing && (
          <Button variant="outlined" startIcon={<Edit />} onClick={() => setIsEditing(true)}
            sx={{ borderColor: '#14b8a6', color: '#14b8a6' }}>
            Editar
          </Button>
        )}
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

      {!bankAccount && !isEditing ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <AccountBalance sx={{ fontSize: 64, color: '#e5e7eb', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No tienes una cuenta bancaria registrada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Agrega tus datos bancarios para recibir pagos
            </Typography>
            <Button variant="contained" startIcon={<AccountBalance />} onClick={() => setIsEditing(true)}
              sx={{ backgroundColor: '#14b8a6', '&:hover': { backgroundColor: '#0d9488' } }}>
              Agregar Cuenta Bancaria
            </Button>
          </CardContent>
        </Card>
      ) : isEditing ? (
        <Card>
          <CardContent>
            <form onSubmit={formik.handleSubmit}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                {bankAccount ? 'Editar Datos Bancarios' : 'Agregar Datos Bancarios'}
              </Typography>
              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth select label="Banco *" name="bankName"
                    value={formik.values.bankName} onChange={formik.handleChange}
                    error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                    helperText={formik.touched.bankName && formik.errors.bankName}>
                    {ECUADOR_BANKS.map((bank) => <MenuItem key={bank} value={bank}>{bank}</MenuItem>)}
                  </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth select label="Tipo de Cuenta *" name="accountType"
                    value={formik.values.accountType} onChange={formik.handleChange}
                    error={formik.touched.accountType && Boolean(formik.errors.accountType)}
                    helperText={formik.touched.accountType && formik.errors.accountType}>
                    <MenuItem value="checking">Corriente</MenuItem>
                    <MenuItem value="savings">Ahorros</MenuItem>
                  </TextField>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Número de Cuenta *" name="accountNumber"
                    value={formik.values.accountNumber} onChange={formik.handleChange}
                    error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                    helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                    placeholder="1234567890" />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField fullWidth label="Titular de la Cuenta *" name="accountHolder"
                    value={formik.values.accountHolder} onChange={formik.handleChange}
                    error={formik.touched.accountHolder && Boolean(formik.errors.accountHolder)}
                    helperText={formik.touched.accountHolder && formik.errors.accountHolder}
                    placeholder="Juan Pérez" />
                </Grid2>
              </Grid2>
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button variant="outlined" onClick={() => { setIsEditing(false); formik.resetForm(); }} disabled={saving}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" startIcon={<Save />} disabled={saving}
                  sx={{ backgroundColor: '#14b8a6', '&:hover': { backgroundColor: '#0d9488' } }}>
                  {saving ? 'Guardando...' : 'Guardar Datos'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Datos Bancarios Registrados</Typography>
              <Chip icon={<CheckCircle />} label="Configurado" color="success" size="small" />
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Banco</Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>{bankAccount!.bankName}</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Tipo de Cuenta</Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>{bankAccount!.accountType === 'checking' ? 'Corriente' : 'Ahorros'}</Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Número de Cuenta</Typography>
                <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 700, color: '#14b8a6', letterSpacing: 1, fontFamily: 'monospace' }}>
                  {bankAccount!.accountNumber}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>Titular de la Cuenta</Typography>
                <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>{bankAccount!.accountHolder}</Typography>
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      )}

      <Alert severity="warning" sx={{ mt: 3 }} icon={<Warning />}>
        <Typography variant="body2" fontWeight={600}>Mantén tus datos actualizados</Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Si cambias de cuenta bancaria, actualiza estos datos inmediatamente para evitar retrasos en tus pagos.
        </Typography>
      </Alert>

    </Box>
  );
};
