import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Button,
  TextField,
  MenuItem,
  Snackbar,
} from '@mui/material';
import { AccountBalance, Info, Edit, Save, CheckCircle } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { BankAccount } from '../../../clinic-panel/domain/clinic.entity';
import { useAuthStore } from '../../../../app/store/auth.store';

// Lista de bancos de Ecuador
const ECUADOR_BANKS = [
  'Banco Pichincha',
  'Banco del Pacífico',
  'Banco de Guayaquil',
  'Produbanco',
  'Banco Bolivariano',
  'Banco Internacional',
  'Banco del Austro',
  'Banco General Rumiñahui',
  'Banco ProCredit',
  'Banco Solidario',
  'Banco Comercial de Manabí',
  'Banco Coopnacional',
  'Banco Capital',
  'Banco Finca',
  'Banco D-MIRO',
  'Banco Diners Club',
];

const validationSchema = Yup.object({
  bankName: Yup.string().required('El banco es requerido'),
  accountNumber: Yup.string()
    .required('El número de cuenta es requerido')
    .min(10, 'El número de cuenta debe tener al menos 10 dígitos')
    .matches(/^\d+$/, 'Solo se permiten números'),
  accountType: Yup.string()
    .required('El tipo de cuenta es requerido')
    .oneOf(['checking', 'savings'], 'Tipo de cuenta inválido'),
  accountHolder: Yup.string().required('El titular de la cuenta es requerido'),
  identificationNumber: Yup.string()
    .required('La cédula/RUC es requerida')
    .min(10, 'Debe tener al menos 10 dígitos')
    .max(13, 'Debe tener máximo 13 dígitos')
    .matches(/^\d+$/, 'Solo se permiten números'),
});

export const DoctorBankAccountSection = () => {
  const { user } = useAuthStore();
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const storageKey = user?.id ? `doctor_bank_account_${user.id}` : 'doctor_bank_account';

  useEffect(() => {
    loadBankAccount();
  }, []);

  const loadBankAccount = () => {
    setLoading(true);
    try {
      // Cargar desde localStorage (mock) por doctor
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setBankAccount(JSON.parse(saved));
      } else {
        setBankAccount(null);
      }
    } catch (error) {
      console.error('Error al cargar datos bancarios del médico:', error);
      setBankAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      bankName: bankAccount?.bankName || '',
      accountNumber: bankAccount?.accountNumber || '',
      accountType: bankAccount?.accountType || 'checking',
      accountHolder: bankAccount?.accountHolder || '',
      identificationNumber: bankAccount?.identificationNumber || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSaving(true);
      try {
        const newBankAccount: BankAccount = {
          bankName: values.bankName,
          accountNumber: values.accountNumber,
          accountType: values.accountType as 'checking' | 'savings',
          accountHolder: values.accountHolder,
          identificationNumber: values.identificationNumber,
        };

        // Guardar en localStorage (mock) usando el ID del médico
        localStorage.setItem(storageKey, JSON.stringify(newBankAccount));

        setBankAccount(newBankAccount);
        setIsEditing(false);
        setSnackbar({
          open: true,
          message: 'Datos bancarios guardados correctamente',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error al guardar datos bancarios:', error);
        setSnackbar({
          open: true,
          message: 'Error al guardar los datos bancarios',
          severity: 'error',
        });
      } finally {
        setSaving(false);
      }
    },
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const accountTypeLabel = bankAccount?.accountType === 'checking' ? 'Corriente' : 'Ahorros';

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AccountBalance sx={{ fontSize: 32, color: '#14b8a6' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Mi Cuenta Bancaria
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Datos para recibir pagos de la clínica
          </Typography>
        </Box>
        {bankAccount && !isEditing && (
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
            sx={{ borderColor: '#14b8a6', color: '#14b8a6' }}
          >
            Editar
          </Button>
        )}
      </Box>

      <Alert severity="info" icon={<Info />} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600}>
          Información Importante
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Estos datos bancarios serán utilizados por la clínica para realizar los depósitos de tus pagos.
          Asegúrate de que la información sea correcta y esté actualizada.
        </Typography>
      </Alert>

      {!bankAccount && !isEditing ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <AccountBalance sx={{ fontSize: 64, color: '#e5e7eb', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              No has configurado tu cuenta bancaria
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Agrega tus datos bancarios para que la clínica pueda realizar los pagos
            </Typography>
            <Button
              variant="contained"
              startIcon={<AccountBalance />}
              onClick={() => setIsEditing(true)}
              sx={{ backgroundColor: '#14b8a6', '&:hover': { backgroundColor: '#0d9488' } }}
            >
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
                  <TextField
                    fullWidth
                    select
                    label="Banco *"
                    name="bankName"
                    value={formik.values.bankName}
                    onChange={formik.handleChange}
                    error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                    helperText={formik.touched.bankName && formik.errors.bankName}
                  >
                    {ECUADOR_BANKS.map((bank) => (
                      <MenuItem key={bank} value={bank}>
                        {bank}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    select
                    label="Tipo de Cuenta *"
                    name="accountType"
                    value={formik.values.accountType}
                    onChange={formik.handleChange}
                    error={formik.touched.accountType && Boolean(formik.errors.accountType)}
                    helperText={formik.touched.accountType && formik.errors.accountType}
                  >
                    <MenuItem value="checking">Corriente</MenuItem>
                    <MenuItem value="savings">Ahorros</MenuItem>
                  </TextField>
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Número de Cuenta *"
                    name="accountNumber"
                    value={formik.values.accountNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.accountNumber && Boolean(formik.errors.accountNumber)}
                    helperText={formik.touched.accountNumber && formik.errors.accountNumber}
                    placeholder="1234567890"
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Titular de la Cuenta *"
                    name="accountHolder"
                    value={formik.values.accountHolder}
                    onChange={formik.handleChange}
                    error={formik.touched.accountHolder && Boolean(formik.errors.accountHolder)}
                    helperText={formik.touched.accountHolder && formik.errors.accountHolder}
                    placeholder="Juan Pérez"
                  />
                </Grid2>

                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Cédula / RUC *"
                    name="identificationNumber"
                    value={formik.values.identificationNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.identificationNumber && Boolean(formik.errors.identificationNumber)}
                    helperText={formik.touched.identificationNumber && formik.errors.identificationNumber}
                    placeholder="1234567890"
                  />
                </Grid2>
              </Grid2>

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    formik.resetForm();
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={saving}
                  sx={{ backgroundColor: '#14b8a6', '&:hover': { backgroundColor: '#0d9488' } }}
                >
                  {saving ? 'Guardando...' : 'Guardar Datos'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            {bankAccount && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Datos Bancarios Registrados
                  </Typography>
                  <Chip
                    icon={<CheckCircle />}
                    label="Configurado"
                    color="success"
                    size="small"
                  />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Banco
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                        {bankAccount.bankName}
                      </Typography>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Tipo de Cuenta
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                        {accountTypeLabel}
                      </Typography>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Número de Cuenta
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          mt: 0.5,
                          fontWeight: 700,
                          color: '#14b8a6',
                          letterSpacing: 1,
                          fontFamily: 'monospace',
                        }}
                      >
                        {bankAccount.accountNumber}
                      </Typography>
                    </Box>
                  </Grid2>

                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Titular de la Cuenta
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 500 }}>
                        {bankAccount.accountHolder}
                      </Typography>
                    </Box>
                  </Grid2>

                  {bankAccount.identificationNumber && (
                    <Grid2 size={{ xs: 12, md: 6 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Cédula / RUC
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            mt: 0.5,
                            fontWeight: 500,
                            fontFamily: 'monospace',
                          }}
                        >
                          {bankAccount.identificationNumber}
                        </Typography>
                      </Box>
                    </Grid2>
                  )}
                </Grid2>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2" fontWeight={600}>
          Mantén tus datos actualizados
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          Es importante que mantengas esta información actualizada para evitar retrasos en tus pagos.
          Si cambias de cuenta bancaria, actualiza estos datos inmediatamente.
        </Typography>
      </Alert>

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
