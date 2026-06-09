import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  AttachMoney,
  CheckCircle,
  HourglassEmpty,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import Grid2 from '@mui/material/Grid2';
import { useState, useMemo } from 'react';
import { useClinicPayments } from '../hooks/useClinicPayments';
import { useClinicDoctors } from '../../association/hooks/useClinicDoctors';
import { formatMoney } from '../../../shared/lib/formatMoney';
import { PaymentDistributionModal } from './PaymentDistributionModal';
import { DoctorPaymentsList } from './DoctorPaymentsList';
import type { ClinicPayment } from '../types/clinic-payment.entity';

interface ClinicPaymentsSectionProps {
  clinicId: string;
}

export const ClinicPaymentsSection = ({ clinicId }: ClinicPaymentsSectionProps) => {
  const { clinicPayments, doctorPayments, loading, error, clinicTotal, page, setPage, limit, setLimit, distributePayment, payDoctor } =
    useClinicPayments(clinicId);
  const { doctors } = useClinicDoctors(clinicId);

  const [distributionModalOpen, setDistributionModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<ClinicPayment | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: limit });

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

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setPage(model.page + 1);
    setLimit(model.pageSize);
  };

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Fecha",
      width: 120,
      valueGetter: (_value, row) => new Date(row.createdAt).toLocaleDateString('es-ES'),
    },
    {
      field: "totalAmount",
      headerName: "Total Cobrado",
      width: 140,
      align: "right",
      renderCell: (params) => <Typography fontWeight={600}>{formatMoney(params.value)}</Typography>,
    },
    {
      field: "appCommission",
      headerName: "Comisión App",
      width: 130,
      align: "right",
      renderCell: (params) => <Typography color="text.secondary">{formatMoney(params.value)}</Typography>,
    },
    {
      field: "netAmount",
      headerName: "Total Neto",
      width: 130,
      align: "right",
      renderCell: (params) => <Typography fontWeight={600} color="#10b981">{formatMoney(params.value)}</Typography>,
    },
    {
      field: "status",
      headerName: "Estado",
      width: 120,
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value === 'paid' ? 'Pagado' : 'Pendiente'}
          color={params.value === 'paid' ? 'success' : 'warning'}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 130,
      align: "center",
      sortable: false,
      renderCell: (params) => (
        !params.row.isDistributed ? (
          <Button variant="contained" size="small" onClick={() => handleDistributeClick(params.row)} sx={{ textTransform: 'none' }}>
            Distribuir
          </Button>
        ) : (
          <Chip label="Distribuido" color="success" size="small" />
        )
      ),
    },
  ];

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
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} mb={1}>
          Gestión de Pagos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra los pagos recibidos del administrador y distribúyelos a tus médicos
        </Typography>
      </Box>

      <Grid2 container spacing={3} mb={4}>
        <Grid2 size={{ xs: 12, sm: 4 }}>
          <Card elevation={0} sx={{ bgcolor: '#f0fdfa', border: '1px solid #d1fae5' }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AttachMoney sx={{ color: '#14b8a6', fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Recibido</Typography>
                  <Typography variant="h6" fontWeight={700} color="#14b8a6">{formatMoney(totals.totalReceived)}</Typography>
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
                  <Typography variant="caption" color="text.secondary">Pendiente</Typography>
                  <Typography variant="h6" fontWeight={700} color="#f59e0b">{formatMoney(totals.totalPending)}</Typography>
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
                  <Typography variant="caption" color="text.secondary">Pagado</Typography>
                  <Typography variant="h6" fontWeight={700} color="#10b981">{formatMoney(totals.totalPaid)}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <Box mb={4}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Pagos Recibidos del Administrador
        </Typography>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={clinicPayments}
            columns={columns}
            loading={loading}
            paginationMode="server"
            rowCount={clinicTotal}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            sx={{ border: "1px solid #e5e7eb" }}
          />
        </Box>
      </Box>

      <DoctorPaymentsList payments={doctorPayments} onPayDoctor={payDoctor} />

      <PaymentDistributionModal
        open={distributionModalOpen}
        onClose={() => { setDistributionModalOpen(false); setSelectedPayment(null); }}
        payment={selectedPayment}
        doctors={doctors}
        onDistribute={handleDistribute}
      />
    </Box>
  );
};
