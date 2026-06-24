import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import { AccountBalance, Edit, Add, CheckCircle, Warning } from '@mui/icons-material';
import { useState } from 'react';
import type { BankAccount } from '../types/clinic.entity';
import { BankAccountModal } from '../../../shared/components/BankAccountModal';
import { useAuthStore } from '../../../app/store/auth.store';

interface BankAccountSectionProps {
  clinicId: string;
  bankAccount?: BankAccount;
  onUpdate: (account: BankAccount) => Promise<void>;
}

export const BankAccountSection = ({ clinicId: _clinicId, bankAccount, onUpdate }: BankAccountSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await onUpdate(values as BankAccount);
      setDialogOpen(false);
    } catch {
      // Error handled by parent hook
    } finally {
      setLoading(false);
    }
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
          onClick={() => setDialogOpen(true)}
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
                <div>
                  <Chip
                    label={bankAccount.accountType === 'checking' ? 'Corriente' : 'Ahorros'}
                    size="small"
                    sx={{ mt: 0.5, bgcolor: '#14b8a6', color: 'white' }}
                  />
                </div>
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

              {bankAccount.email && (
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Correo Electrónico
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {bankAccount.email}
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

      <BankAccountModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bankAccount={bankAccount}
        onSave={handleSave}
        loading={loading}
        defaultEmail={user?.email}
      />
    </Box>
  );
};
