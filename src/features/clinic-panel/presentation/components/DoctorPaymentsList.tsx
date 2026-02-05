import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
} from '@mui/material';
import { Payment as PaymentIcon, CheckCircle, HourglassEmpty, AccountBalance, Close } from '@mui/icons-material';
import Grid2 from '@mui/material/Grid2';
import { useState } from 'react';
import type { ClinicToDoctorPayment } from '../../domain/clinic-to-doctor-payment.entity';
import { formatMoney } from '../../../../shared/lib/formatMoney';

interface DoctorPaymentsListProps {
  payments: ClinicToDoctorPayment[];
  onPayDoctor: (doctorId: string, paymentId: string) => Promise<void>;
}

export const DoctorPaymentsList = ({ payments, onPayDoctor }: DoctorPaymentsListProps) => {
  const [selectedPayment, setSelectedPayment] = useState<ClinicToDoctorPayment | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayClick = (payment: ClinicToDoctorPayment) => {
    setSelectedPayment(payment);
    setConfirmDialogOpen(true);
  };

  const handleConfirmPay = async () => {
    if (!selectedPayment) return;

    try {
      setLoading(true);
      await onPayDoctor(selectedPayment.doctorId, selectedPayment.id);
      setConfirmDialogOpen(false);
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error al pagar:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar pagos por médico
  const paymentsByDoctor = payments.reduce((acc, payment) => {
    if (!acc[payment.doctorId]) {
      acc[payment.doctorId] = {
        doctorName: payment.doctorName,
        payments: [],
        totalPending: 0,
        totalPaid: 0,
      };
    }
    acc[payment.doctorId].payments.push(payment);
    if (payment.status === 'pending') {
      acc[payment.doctorId].totalPending += payment.amount;
    } else {
      acc[payment.doctorId].totalPaid += payment.amount;
    }
    return acc;
  }, {} as Record<string, { doctorName: string; payments: ClinicToDoctorPayment[]; totalPending: number; totalPaid: number }>);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Pagos a Médicos
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f9fafb' }}>
              <TableCell sx={{ fontWeight: 600 }}>Médico</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Monto
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Fecha
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No hay pagos registrados
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'primary.light', width: 40, height: 40 }}>
                        {payment.doctorName.charAt(0)}
                      </Avatar>
                      <Typography fontWeight={600}>{payment.doctorName}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={600} color="#10b981">
                      {formatMoney(payment.amount)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={payment.status === 'paid' ? <CheckCircle /> : <HourglassEmpty />}
                      label={payment.status === 'paid' ? 'Pagado' : 'Pendiente'}
                      color={payment.status === 'paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString('es-ES')
                        : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {payment.status === 'pending' ? (
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        startIcon={<PaymentIcon />}
                        onClick={() => handlePayClick(payment)}
                        sx={{ textTransform: 'none' }}
                      >
                        Pagar
                      </Button>
                    ) : (
                      <Chip label="Completado" color="success" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog de Confirmación de Pago */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => !loading && setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Confirmar Pago al Médico
            </Typography>
            <IconButton onClick={() => setConfirmDialogOpen(false)} disabled={loading}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent>
          {selectedPayment && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Confirma que has realizado la transferencia bancaria al médico
              </Alert>

              {/* Datos del Pago */}
              <Box sx={{ bgcolor: '#f9fafb', p: 3, borderRadius: 2, mb: 3 }}>
                <Grid2 container spacing={2}>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">
                      Médico
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedPayment.doctorName}
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary">
                      Monto a Pagar
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#10b981">
                      {formatMoney(selectedPayment.amount)}
                    </Typography>
                  </Grid2>
                </Grid2>
              </Box>

              {/* Datos Bancarios */}
              {selectedPayment.doctorBankAccount && (
                <Box sx={{ bgcolor: '#fff7ed', p: 3, borderRadius: 2, border: '2px solid #fbbf24' }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <AccountBalance sx={{ color: '#f59e0b' }} />
                    <Typography variant="subtitle1" fontWeight={700} color="#f59e0b">
                      Datos Bancarios
                    </Typography>
                  </Stack>
                  <Grid2 container spacing={2}>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Banco
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedPayment.doctorBankAccount.bankName}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Número de Cuenta
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                        {selectedPayment.doctorBankAccount.accountNumber}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Tipo
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedPayment.doctorBankAccount.accountType === 'checking' ? 'Corriente' : 'Ahorros'}
                      </Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        Titular
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {selectedPayment.doctorBankAccount.accountHolder}
                      </Typography>
                    </Grid2>
                  </Grid2>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmPay}
            variant="contained"
            color="success"
            disabled={loading}
            sx={{ textTransform: 'none' }}
          >
            {loading ? 'Procesando...' : 'Confirmar Pago Realizado'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
