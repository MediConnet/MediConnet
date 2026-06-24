import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Stack,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { ECUADOR_BANKS } from '../config/domain.constants';
import { bankAccountValidationSchema } from '../validation/bank-account.validation';

interface BankAccountModalProps {
  open: boolean;
  onClose: () => void;
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountType: string;
    accountHolder: string;
    identificationNumber?: string | null;
    email?: string | null;
  } | null;
  onSave: (values: {
    bankName: string;
    accountNumber: string;
    accountType: string;
    accountHolder: string;
    identificationNumber: string;
    email: string;
  }) => Promise<void>;
  loading: boolean;
  defaultEmail?: string;
}

export const BankAccountModal = ({
  open,
  onClose,
  bankAccount,
  onSave,
  loading,
  defaultEmail = '',
}: BankAccountModalProps) => {
  const formik = useFormik({
    initialValues: {
      bankName: '',
      accountNumber: '',
      accountType: '',
      accountHolder: '',
      identificationNumber: '',
      email: '',
    },
    validationSchema: bankAccountValidationSchema,
    onSubmit: async (values) => {
      await onSave(values);
    },
  });

  useEffect(() => {
    if (open) {
      if (bankAccount) {
        formik.setValues({
          bankName: bankAccount.bankName || '',
          accountNumber: bankAccount.accountNumber || '',
          accountType: bankAccount.accountType || '',
          accountHolder: bankAccount.accountHolder || '',
          identificationNumber: bankAccount.identificationNumber || '',
          email: bankAccount.email || defaultEmail || '',
        });
      } else {
        formik.resetForm();
        formik.setFieldValue('email', defaultEmail);
      }
    }
  }, [open, bankAccount, defaultEmail]);

  return (
    <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Typography variant="h6" fontWeight={700}>
            {bankAccount ? 'Editar Cuenta Bancaria' : 'Agregar Cuenta Bancaria'}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth error={formik.touched.bankName && Boolean(formik.errors.bankName)}>
              <InputLabel>Banco *</InputLabel>
              <Select
                name="bankName"
                value={formik.values.bankName}
                onChange={formik.handleChange}
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

            <FormControl fullWidth error={formik.touched.accountType && Boolean(formik.errors.accountType)}>
              <InputLabel>Tipo de Cuenta *</InputLabel>
              <Select
                name="accountType"
                value={formik.values.accountType}
                onChange={formik.handleChange}
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

            <TextField
              fullWidth
              label="Correo Electrónico *"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              placeholder="correo@ejemplo.com"
            />

            <Alert severity="info">
              <Typography variant="body2">
                Asegúrate de que los datos sean correctos. El administrador utilizará esta información para realizar las transferencias.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
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
  );
};
