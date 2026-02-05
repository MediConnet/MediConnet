import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  AttachMoney,
  CreditCard,
  CheckCircle,
  HourglassEmpty,
  AccountBalance,
} from '@mui/icons-material';
import Grid2 from '@mui/material/Grid2';
import { useState, useMemo } from 'react';
import { useClinicPayments } from '../hooks/useClinicPayments';
import { useClinicDoctors } from '../hooks/useClinicDoctors';
import { formatMoney } from '../../../../shared/lib/formatMoney';
import { PaymentDistributionModal } from './PaymentDistributionModal';
import { DoctorPaymentsList } from './DoctorPaymentsList';
import type { ClinicPayment } from '../../domain/clinic-payment.entity';

interface ClinicPaymentsSectionProps {
  clinicId: string;
}

export const ClinicPaymentsSection = ({ clinicId }: ClinicPaymentsSectionProps) => {
  const { clinicPayments, doctorPayments, loading, error, distributePayment, payDoctor, refetch } =
    useClinicPayments(clinicId);
  const { doctors } = useClinicDoctors(clinicId);

  const [distributionModalOpen, setDistributionModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ClinicPayment | null>(null);

  // Calcular totales
  const totals = useMemo(() => {
    const totalReceived = clinicPayments.reduce((sum, p) => sum + p.netAmount, 0);
    const totalPending = clinicPayments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.netAmount, 0);
    const totalPaid = clinicPayments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.netAmount, 0);

    return { totalReceived, totalPending, totalPaid };
  }, [clinicPayments]);

  const handleDistributeClick = (payment: ClinicPayment) => {
    setSelectedPayment(payment);
    setDistributionModalOpen(true);
  };

  const handleDistribute = async (distribution: { doctorId: string; amount: number }[]) => {
    if (!selectedPayment) return;
    await distributePayment(selectedPayment.id, distribution);
    setDistributionModalOpen(false);
    setSelectedPayment(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} mb={1}>
          Gestión de Pagos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra los pagos recibidos del administrador y distribúyelos a tus médicos
        </Typography>
      </Box>

      {/* Resumen de Totales */}
      <Grid2 container spacing={3} mb={4}>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ bgcolor: '#f0fdfa', border: '1px solid #d1fae5' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney sx={{ color: '#14b8a6', fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Recibido
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#14b8a6">
                    {formatMoney(totals.totalReceived)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ bgcolor: '#fef3c7', border: '1px solid #fde68a' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <HourglassEmpty sx={{ color: '#f59e0b', fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pendiente
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#f59e0b">
                    {formatMoney(totals.totalPending)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ bgcolor: '#ecfdf5', border: '1px solid #a7f3d0' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <CheckCircle sx={{ color: '#10b981', fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pagado
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#10b981">
                    {formatMoney(totals.totalPaid)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Pagos Recibidos del Administrador */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Pagos Recibidos del Administrador
        </Typography>

        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Total Cobrado
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Comisión App
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  Total Neto
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Estado
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clinicPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No hay pagos registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                clinicPayments.map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(payment.createdAt).toLocaleDateString('es-ES')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600}>
                        {formatMoney(payment.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="text.secondary">
                        {formatMoney(payment.appCommission)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600} color="#10b981">
                        {formatMoney(payment.netAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                        color={payment.status === 'paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {!payment.isDistributed ? (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleDistributeClick(payment)}
                          sx={{ textTransform: 'none' }}
                        >
                          Distribuir
                        </Button>
                      ) : (
                        <Chip label="Distribuido" color="success" size="small" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Pagos a Médicos */}
      <DoctorPaymentsList payments={doctorPayments} onPayDoctor={payDoctor} />

      {/* Modal de Distribución */}
      <PaymentDistributionModal
        open={distributionModalOpen}
        onClose={() => {
          setDistributionModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        doctors={doctors}
        onDistribute={handleDistribute}
      />
    </Box>
  );
};
