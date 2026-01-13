import { AttachMoney, CreditCard, Visibility } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useMemo } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { getPaymentsMock } from "../../../doctor-panel/infrastructure/payments.mock";
import type { Payment } from "../../../doctor-panel/domain/Payment.entity";
import { formatMoney } from "../../../../shared/lib/formatMoney";
import { Close } from "@mui/icons-material";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

export const PaymentsPage = () => {
  const [payments] = useState<Payment[]>(getPaymentsMock());
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Obtener lista única de doctores con pagos con tarjeta
  const doctors = useMemo(() => {
    const uniqueDoctors = new Set(payments.map((p) => p.patientName));
    return Array.from(uniqueDoctors);
  }, [payments]);

  // Agrupar pagos por médico
  const paymentsByDoctor = useMemo(() => {
    const grouped = new Map<string, Payment[]>();
    payments.forEach((payment) => {
      const doctorName = payment.patientName;
      if (!grouped.has(doctorName)) {
        grouped.set(doctorName, []);
      }
      grouped.get(doctorName)!.push(payment);
    });
    return grouped;
  }, [payments]);

  // Calcular totales por médico
  const doctorTotals = useMemo(() => {
    const totals = new Map<string, { totalAmount: number; totalCommission: number; totalNet: number; count: number }>();
    payments.forEach((payment) => {
      const doctorName = payment.patientName;
      if (!totals.has(doctorName)) {
        totals.set(doctorName, { totalAmount: 0, totalCommission: 0, totalNet: 0, count: 0 });
      }
      const doctorTotal = totals.get(doctorName)!;
      doctorTotal.totalAmount += payment.amount;
      doctorTotal.totalCommission += payment.commission;
      doctorTotal.totalNet += payment.netAmount;
      doctorTotal.count += 1;
    });
    return totals;
  }, [payments]);

  // Obtener pagos del médico seleccionado
  const selectedDoctorPayments = useMemo(() => {
    if (!selectedDoctor) return [];
    return paymentsByDoctor.get(selectedDoctor) || [];
  }, [selectedDoctor, paymentsByDoctor]);

  const filteredPayments = useMemo(() => {
    let filtered = payments;

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (doctorFilter !== "all") {
      filtered = filtered.filter((p) => p.patientName === doctorFilter);
    }

    return filtered;
  }, [payments, statusFilter, doctorFilter]);

  const totals = useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalCommission = filteredPayments.reduce((sum, p) => sum + p.commission, 0);
    const totalNet = filteredPayments.reduce((sum, p) => sum + p.netAmount, 0);
    return { totalAmount, totalCommission, totalNet };
  }, [filteredPayments]);

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <AttachMoney sx={{ fontSize: 32, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Pagos de Médicos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detalle de pagos con tarjeta y comisiones de la app
            </Typography>
          </Box>
        </Stack>

        {/* Filtros */}
        <Box mb={4}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Estado del Pago</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado del Pago"
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  <MenuItem value="pending">Pendientes</MenuItem>
                  <MenuItem value="paid">Pagados</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Médico</InputLabel>
                <Select
                  value={doctorFilter}
                  label="Médico"
                  onChange={(e) => setDoctorFilter(e.target.value)}
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor} value={doctor}>
                      {doctor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
          </Grid2>
        </Box>

        {/* Resumen de totales */}
        <Grid2 container spacing={3} mb={4}>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Card elevation={0} sx={{ bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AttachMoney sx={{ color: "#14b8a6", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Cobrado
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#14b8a6">
                      {formatMoney(totals.totalAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Card elevation={0} sx={{ bgcolor: "#fef3c7", border: "1px solid #fde68a" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CreditCard sx={{ color: "#f59e0b", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Comisiones Totales
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#f59e0b">
                      {formatMoney(totals.totalCommission)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 4 }}>
            <Card elevation={0} sx={{ bgcolor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AttachMoney sx={{ color: "#10b981", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Neto Médicos
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="#10b981">
                      {formatMoney(totals.totalNet)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        {/* Lista de Médicos con Pagos */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Médicos con Pagos con Tarjeta
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Médico</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Total de Pagos
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Total Cobrado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Total Comisión
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Total Neto
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(doctors).map((doctorName) => {
                  const doctorTotal = doctorTotals.get(doctorName)!;
                  return (
                    <TableRow key={doctorName} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                            {doctorName.charAt(0)}
                          </Avatar>
                          <Typography fontWeight={600}>{doctorName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={doctorTotal.count} color="primary" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>{formatMoney(doctorTotal.totalAmount)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="text.secondary">
                          {formatMoney(doctorTotal.totalCommission)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600} color="#10b981">
                          {formatMoney(doctorTotal.totalNet)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => {
                            setSelectedDoctor(doctorName);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          Ver Detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Tabla de pagos (detalle) */}
        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Detalle de Pagos
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Médico</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Monto Cobrado
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Comisión (15%)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    Total Neto
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Estado
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No hay pagos registrados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                            {payment.patientName.charAt(0)}
                          </Avatar>
                          <Typography fontWeight={600}>{payment.patientName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>{formatMoney(payment.amount)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="text.secondary">
                          {formatMoney(payment.commission)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600} color="#10b981">
                          {formatMoney(payment.netAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={payment.status === "paid" ? "Pagado" : "Pendiente"}
                          color={payment.status === "paid" ? "success" : "warning"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Modal de Detalle del Médico */}
        <Dialog
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedDoctor(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Detalle de Pagos - {selectedDoctor}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Pagos con tarjeta y comisiones
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedDoctor(null);
                }}
              >
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedDoctor && (
              <Box>
                {/* Resumen del Médico */}
                <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
                  <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Cobrado
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#14b8a6">
                          {formatMoney(doctorTotals.get(selectedDoctor)?.totalAmount || 0)}
                        </Typography>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Comisión (15%)
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#f59e0b">
                          {formatMoney(doctorTotals.get(selectedDoctor)?.totalCommission || 0)}
                        </Typography>
                      </Box>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 4 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Neto del Médico
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#10b981">
                          {formatMoney(doctorTotals.get(selectedDoctor)?.totalNet || 0)}
                        </Typography>
                      </Box>
                    </Grid2>
                  </Grid2>
                </Paper>

                {/* Lista de Pagos */}
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Pagos Individuales
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f9fafb" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                          Monto Cobrado
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                          Comisión
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                          Neto
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="center">
                          Estado
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedDoctorPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.date).toLocaleDateString("es-ES")}
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600}>{formatMoney(payment.amount)}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography color="text.secondary">
                              {formatMoney(payment.commission)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight={600} color="#10b981">
                              {formatMoney(payment.netAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={payment.status === "paid" ? "Pagado" : "Pendiente"}
                              color={payment.status === "paid" ? "success" : "warning"}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

