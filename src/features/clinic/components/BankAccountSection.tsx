import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import { AccountBalance, Edit, Add, CheckCircle, Warning } from '@mui/icons-material';
import { useState } from 'react';
import { useFormik } from 'formik';
import type { BankAccount } from '../types/clinic.entity';
import { ECUADOR_BANKS } from '../../../shared/config/domain.constants';
import { bankAccountValidationSchema } from '../../../shared/validation/bank-account.validation';

interface BankAccountSectionProps {
  clinicId: string;
  bankAccount?: BankAccount;
  onUpdate: (account: BankAccount) => Promise<void>;
}

export const BankAccountSection = ({ clinicId: _clinicId, bankAccount, onUpdate }: BankAccountSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      bankName: bankAccount?.bankName || '',
      accountNumber: bankAccount?.accountNumber || '',
      accountType: bankAccount?.accountType || '',
      accountHolder: bankAccount?.accountHolder || '',
      identificationNumber: bankAccount?.identificationNumber || '',
    },
    validationSchema: bankAccountValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await onUpdate(values as BankAccount);
        setDialogOpen(false);
        formik.resetForm({ values });
      } catch {
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOpenDialog = () => {
    if (bankAccount) {
      formik.setValues({
        bankName: bankAccount.bankName,
        accountNumber: bankAccount.accountNumber,
        accountType: bankAccount.accountType,
        accountHolder: bankAccount.accountHolder,
        identificationNumber: bankAccount.identificationNumber || '',
      });
    } else {
      formik.resetForm();
    }
    setDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalance sx={{ color: '#14b8a6' }} />
            Datos Bancarios
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Configura tu cuenta bancaria para recibir pagos del administrador
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={bankAccount ? <Edit /> : <Add />}
          onClick={handleOpenDialog}
          sx={{ backgroundColor: '#14b8a6', '&:hover': { backgroundColor: '#0d9488' } }}
        >
          {bankAccount ? 'Editar Cuenta' : 'Agregar Cuenta'}
        </Button>
      </Box>

      {!bankAccount ? (
        <Alert severity="warning" icon={<Warning />} sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            No has configurado tu cuenta bancaria
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Agrega tus datos bancarios para que el administrador pueda realizar los pagos de las consultas.
          </Typography>
        </Alert>
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
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Banco
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {bankAccount.bankName}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Número de Cuenta
                </Typography>
                <Typography variant="body1" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                  {bankAccount.accountNumber}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Tipo de Cuenta
                </Typography>
                <Chip
                  label={bankAccount.accountType === 'checking' ? 'Corriente' : 'Ahorros'}
                  size="small"
                  sx={{ mt: 0.5, bgcolor: '#14b8a6', color: 'white' }}
                />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  Titular
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {bankAccount.accountHolder}
                </Typography>
              </Box>

              {bankAccount.identificationNumber && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    RUC / Cédula
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {bankAccount.identificationNumber}
                  </Typography>
                </Box>
              )}
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                El administrador utilizará estos datos para realizar las transferencias de los pagos de las consultas.
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onClose={() => !loading && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            <Typography variant="h6" fontWeight={700}>
              {bankAccount ? 'Editar Cuenta Bancaria' : 'Agregar Cuenta Bancaria'}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Banco *</InputLabel>
                <Select
                  name="bankName"
                  value={formik.values.bankName}
                  onChange={formik.handleChange}
                  error={formik.touched.bankName && Boolean(formik.errors.bankName)}
                  label="Banco *"
                >
                  {ECUADOR_BANKS.map((bank) => (
                    <MenuItem key={bank} value={bank}>
                      {bank}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.bankName && formik.errors.bankName && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {formik.errors.bankName}
                  </Typography>
                )}
              </FormControl>

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

              <FormControl fullWidth>
                <InputLabel>Tipo de Cuenta *</InputLabel>
                <Select
                  name="accountType"
                  value={formik.values.accountType}
                  onChange={formik.handleChange}
                  error={formik.touched.accountType && Boolean(formik.errors.accountType)}
                  label="Tipo de Cuenta *"
                >
                  <MenuItem value="" disabled>
                    Selecciona un tipo
                  </MenuItem>
                  <MenuItem value="checking">Corriente</MenuItem>
                  <MenuItem value="savings">Ahorros</MenuItem>
                </Select>
                {formik.touched.accountType && formik.errors.accountType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {formik.errors.accountType}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Titular de la Cuenta *"
                name="accountHolder"
                value={formik.values.accountHolder}
                onChange={formik.handleChange}
                error={formik.touched.accountHolder && Boolean(formik.errors.accountHolder)}
                helperText={formik.touched.accountHolder && formik.errors.accountHolder}
                placeholder="Nombre completo o razón social"
              />

              <TextField
                fullWidth
                label="RUC / Cédula (Opcional)"
                name="identificationNumber"
                value={formik.values.identificationNumber}
                onChange={formik.handleChange}
                error={formik.touched.identificationNumber && Boolean(formik.errors.identificationNumber)}
                helperText={formik.touched.identificationNumber && formik.errors.identificationNumber}
                placeholder="1234567890001"
              />

              <Alert severity="info">
                <Typography variant="body2">
                  Asegúrate de que los datos sean correctos. El administrador utilizará esta información para realizar las transferencias.
                </Typography>
              </Alert>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ backgroundColor: '#14b8a6', '&:hover': { backgroundColor: '#0d9488' } }}
            >
              {loading ? 'Guardando...' : 'Guardar Cuenta'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};
