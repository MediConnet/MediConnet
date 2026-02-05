import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Close, AttachMoney, Person } from '@mui/icons-material';
import Grid2 from '@mui/material/Grid2';
import type { ClinicPayment } from '../../domain/clinic-payment.entity';
import type { ClinicDoctor } from '../../domain/doctor.entity';
import { formatMoney } from '../../../../shared/lib/formatMoney';
import { handleNumberInput } from '../../../../shared/lib/inputValidation';

interface PaymentDistributionModalProps {
  open: boolean;
  onClose: () => void;
  payment: ClinicPayment | null;
  doctors: ClinicDoctor[];
  onDistribute: (distribution: { doctorId: string; amount: number }[]) => Promise<void>;
}

export const PaymentDistributionModal = ({
  open,
  onClose,
  payment,
  doctors,
  onDistribute,
}: PaymentDistributionModalProps) => {
  const [distribution, setDistribution] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (payment && doctors.length > 0) {
      // Inicializar distribución vacía
      const initial: Record<string, number> = {};
      doctors.forEach(doctor => {
        initial[doctor.id] = 0;
      });
      setDistribution(initial);
    }
  }, [payment, doctors]);

  const totalDistributed = Object.values(distribution).reduce((sum, amount) => sum + amount, 0);
  const remaining = (payment?.netAmount || 0) - totalDistributed;
  const isValid = totalDistributed > 0 && totalDistributed <= (payment?.netAmount || 0);

  const handleAmountChange = (doctorId: string, value: string) => {
    const amount = parseFloat(value) || 0;
    setDistribution(prev => ({
      ...prev,
      [doctorId]: amount,
    }));
  };

  const handleDistribute = async () => {
    if (!payment || !isValid) return;

    try {
      setLoading(true);
      setError(null);

      const distributionArray = Object.entries(distribution)
        .filter(([_, amount]) => amount > 0)
        .map(([doctorId, amount]) => ({ doctorId, amount }));

      await onDistribute(distributionArray);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al distribuir pago');
    } finally {
      setLoading(false);
    }
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Distribuir Pago a Médicos
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Asigna montos a cada médico del pago recibido
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        {/* Resumen del Pago */}
        <Box sx={{ bgcolor: '#f0fdfa', p: 3, borderRadius: 2, mb: 3, border: '1px solid #d1fae5' }}>
          <Grid2 container spacing={3}>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Total Recibido
              </Typography>
              <Typography variant="h6" fontWeight={700} color="#14b8a6">
                {formatMoney(payment.netAmount)}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Total Distribuido
              </Typography>
              <Typography variant="h6" fontWeight={700} color={totalDistributed > payment.netAmount ? '#ef4444' : '#3b82f6'}>
                {formatMoney(totalDistributed)}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Restante
              </Typography>
              <Typography variant="h6" fontWeight={700} color={remaining < 0 ? '#ef4444' : '#10b981'}>
                {formatMoney(remaining)}
              </Typography>
            </Grid2>
          </Grid2>
        </Box>

        {/* Validación */}
        {totalDistributed > payment.netAmount && (
          <Alert severity="error" sx={{ mb: 2 }}>
            El total distribuido excede el monto recibido
          </Alert>
        )}

        {totalDistributed === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Asigna montos a los médicos para distribuir el pago
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Lista de Médicos */}
        <Typography variant="subtitle1" fontWeight={600} mb={2}>
          Médicos de la Clínica
        </Typography>

        <Stack spacing={2}>
          {doctors.map(doctor => {
            const amount = distribution[doctor.id] || 0;
            const percentage = payment.netAmount > 0 ? (amount / payment.netAmount) * 100 : 0;

            return (
              <Box
                key={doctor.id}
                sx={{
                  p: 2,
                  border: '1px solid #e5e7eb',
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#f9fafb' },
                }}
              >
                <Grid2 container spacing={2} alignItems="center">
                  <Grid2 size={{ xs: 12, sm: 5 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Person sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography fontWeight={600}>{doctor.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {doctor.specialty}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="Monto"
                      type="number"
                      value={amount || ''}
                      onChange={(e) => handleAmountChange(doctor.id, e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney />
                          </InputAdornment>
                        ),
                      }}
                      size="small"
                    />
                  </Grid2>
                  <Grid2 size={{ xs: 12, sm: 3 }}>
                    <Typography variant="body2" color="text.secondary" textAlign="right">
                      {percentage.toFixed(1)}% del total
                    </Typography>
                  </Grid2>
                </Grid2>
              </Box>
            );
          })}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Resumen Final */}
        <Box sx={{ bgcolor: '#fef3c7', p: 2, borderRadius: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" fontWeight={600}>
              Total a Distribuir:
            </Typography>
            <Typography variant="h6" fontWeight={700} color="#f59e0b">
              {formatMoney(totalDistributed)}
            </Typography>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleDistribute}
          variant="contained"
          disabled={!isValid || loading}
          sx={{ textTransform: 'none' }}
        >
          {loading ? 'Distribuyendo...' : 'Confirmar Distribución'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
