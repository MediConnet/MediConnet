import { AttachMoney, CreditCard, Visibility, CheckCircle, Payment as PaymentIcon, AccountBalance, Business, LocalHospital, History } from "@mui/icons-material";
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
  DialogActions,
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
  Alert,
  Divider,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { formatMoney } from "../../../../shared/lib/formatMoney";
import { Close } from "@mui/icons-material";
import { 
  getAdminDoctorPaymentsAPI, 
  getAdminClinicPaymentsAPI,
  markDoctorPaymentsAsPaidAPI,
  markClinicPaymentAsPaidAPI,
  type AdminDoctorPayment,
  type AdminClinicPayment
} from "../../infrastructure/admin-payments.api";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

export const PaymentsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [payments, setPayments] = useState<AdminDoctorPayment[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentConfirmDialogOpen, setIsPaymentConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para clínicas
  const [clinicPayments, setClinicPayments] = useState<AdminClinicPayment[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<AdminClinicPayment | null>(null);
  const [isClinicDetailModalOpen, setIsClinicDetailModalOpen] = useState(false);
  const [isClinicPaymentConfirmDialogOpen, setIsClinicPaymentConfirmDialogOpen] = useState(false);
  const [clinicToPay, setClinicToPay] = useState<AdminClinicPayment | null>(null);
  const [doctorToPay, setDoctorToPay] = useState<string | null>(null);

  // Cargar pagos desde la API
  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const [doctorPaymentsData, clinicPaymentsData] = await Promise.all([
          getAdminDoctorPaymentsAPI(),
          getAdminClinicPaymentsAPI()
        ]);
        setPayments(doctorPaymentsData);
        setClinicPayments(clinicPaymentsData);
      } catch (err: any) {
        setError(err.message || 'Error al cargar pagos');
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  // Obtener lista única de doctores con pagos
  const doctors = useMemo(() => {
    const uniqueDoctors = new Set(payments.map((p) => p.providerName));
    return Array.from(uniqueDoctors).filter((doctorName) => {
      const doctorPayments = payments.filter((p) => p.providerName === doctorName);
      return doctorPayments.some((p) => p.status === "pending");
    });
  }, [payments]);

  // Agrupar pagos por médico
  const paymentsByDoctor = useMemo(() => {
    const grouped = new Map<string, AdminDoctorPayment[]>();
    payments.forEach((payment) => {
      const doctorName = payment.providerName;
      if (!grouped.has(doctorName)) {
        grouped.set(doctorName, []);
      }
      grouped.get(doctorName)!.push(payment);
    });
    return grouped;
  }, [payments]);

  // Calcular totales por médico
  const doctorTotals = useMemo(() => {
    const totals = new Map<string, { totalAmount: number; totalCommission: number; totalNet: number; count: number; pendingCount: number }>();
    payments.forEach((payment) => {
      const doctorName = payment.providerName;
      if (!totals.has(doctorName)) {
        totals.set(doctorName, { totalAmount: 0, totalCommission: 0, totalNet: 0, count: 0, pendingCount: 0 });
      }
      const doctorTotal = totals.get(doctorName)!;
      doctorTotal.totalAmount += payment.amount;
      doctorTotal.totalCommission += payment.commission;
      doctorTotal.totalNet += payment.netAmount;
      doctorTotal.count += 1;
      if (payment.status === "pending") {
        doctorTotal.pendingCount += 1;
      }
    });
    return totals;
  }, [payments]);

  // Función para marcar todos los pagos de un doctor como pagados
  const handleMarkAsPaid = (doctorName: string) => {
    setDoctorToPay(doctorName);
    setIsPaymentConfirmDialogOpen(true);
  };

  const confirmPayment = async () => {
    if (!doctorToPay) return;

    try {
      // Obtener IDs de pagos pendientes del doctor
      const doctorPayments = payments.filter(
        (p) => p.providerName === doctorToPay && p.status === "pending"
      );
      const paymentIds = doctorPayments.map((p) => p.id);
      
      // Obtener el providerId del primer pago
      const providerId = doctorPayments[0]?.providerId;
      if (!providerId) return;

      await markDoctorPaymentsAsPaidAPI(providerId, paymentIds);

      // Actualizar estado local
      setPayments((prevPayments) =>
        prevPayments.map((payment) => {
          if (payment.providerName === doctorToPay && payment.status === "pending") {
            return { ...payment, status: "paid" as const };
          }
          return payment;
        })
      );

      setIsPaymentConfirmDialogOpen(false);
      setDoctorToPay(null);
    } catch (err: any) {
      alert(err.message || 'Error al marcar pagos como pagados');
    }
  };

  // Calcular total neto pendiente por doctor
  const getDoctorPendingTotal = (doctorName: string) => {
    const doctorPayments = payments.filter(
      (p) => p.providerName === doctorName && p.status === "pending"
    );
    return doctorPayments.reduce((sum, p) => sum + p.netAmount, 0);
  };

  // Obtener pagos del médico seleccionado
  const selectedDoctorPayments = useMemo(() => {
    if (!selectedDoctor) return [];
    return paymentsByDoctor.get(selectedDoctor) || [];
  }, [selectedDoctor, paymentsByDoctor]);

  // Función para obtener datos bancarios del doctor desde localStorage
  const getDoctorBankAccount = (doctorName: string) => {
    // Buscar en todos los perfiles de doctores guardados en localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("doctor-profile-")) {
        try {
          const profile = JSON.parse(localStorage.getItem(key) || "{}");
          if (profile?.doctor?.name === doctorName && profile?.doctor?.bankAccount) {
            return profile.doctor.bankAccount;
          }
        } catch (error) {
          console.error("Error reading doctor profile:", error);
        }
      }
    }
    // Si no encuentra datos bancarios, retornar datos por defecto/mock
    return {
      bankName: "Banco Pichincha",
      accountNumber: "2100123456789",
      accountType: "checking",
      accountHolder: doctorName,
    };
  };

  // Obtener datos bancarios del doctor seleccionado
  const selectedDoctorBankAccount = useMemo(() => {
    if (!selectedDoctor) return null;
    return getDoctorBankAccount(selectedDoctor);
  }, [selectedDoctor]);

  const filteredPayments = useMemo(() => {
    let filtered = payments;

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (doctorFilter !== "all") {
      filtered = filtered.filter((p) => p.providerName === doctorFilter);
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
              Gestión de Pagos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Administra los pagos a médicos independientes y clínicas
            </Typography>
          </Box>
        </Stack>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={(_e, newValue) => setCurrentTab(newValue)}
            aria-label="payment tabs"
            disabled={loading}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
              },
            }}
          >
            <Tab
              icon={<LocalHospital />}
              iconPosition="start"
              label="Pagos a Médicos"
            />
            <Tab
              icon={<Business />}
              iconPosition="start"
              label="Pagos a Clínicas"
            />
            <Tab
              icon={<History />}
              iconPosition="start"
              label="Historial"
            />
          </Tabs>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tab Content - Only show when not loading */}
        {!loading && !error && (
          <>
        {/* Tab Content - Pagos a Médicos */}
        {currentTab === 0 && (
          <Box>

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
                        <Box>
                          <Typography fontWeight={600} color="#10b981">
                            {formatMoney(doctorTotal.totalNet)}
                          </Typography>
                          {doctorTotal.pendingCount > 0 && (
                            <Typography variant="caption" color="warning.main" fontWeight={600}>
                              {formatMoney(getDoctorPendingTotal(doctorName))} pendiente
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
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
                          {doctorTotal.pendingCount > 0 && (
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              startIcon={<PaymentIcon />}
                              onClick={() => handleMarkAsPaid(doctorName)}
                            >
                              Marcar como Pagado
                            </Button>
                          )}
                        </Stack>
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
                            {payment.providerName.charAt(0)}
                          </Avatar>
                          <Typography fontWeight={600}>{payment.providerName}</Typography>
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

                {/* Datos Bancarios del Doctor */}
                {selectedDoctorBankAccount && (
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      mb: 3, 
                      bgcolor: "#fff7ed", 
                      border: "2px solid #fbbf24",
                      borderRadius: 2
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                      <AccountBalance sx={{ color: "#f59e0b", fontSize: 24 }} />
                      <Typography variant="h6" fontWeight={700} color="#f59e0b">
                        Datos Bancarios para Transferencia
                      </Typography>
                    </Stack>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Utiliza esta información para realizar la transferencia externa al médico.
                    </Alert>
                    <Grid2 container spacing={2}>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Banco
                          </Typography>
                          <Typography variant="body1" fontWeight={700} color="#1f2937">
                            {selectedDoctorBankAccount.bankName}
                          </Typography>
                        </Box>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Número de Cuenta
                          </Typography>
                          <Typography variant="body1" fontWeight={700} color="#1f2937" sx={{ fontFamily: "monospace" }}>
                            {selectedDoctorBankAccount.accountNumber}
                          </Typography>
                        </Box>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Tipo de Cuenta
                          </Typography>
                          <Typography variant="body1" fontWeight={700} color="#1f2937">
                            {selectedDoctorBankAccount.accountType === "checking" ? "Corriente" : "Ahorros"}
                          </Typography>
                        </Box>
                      </Grid2>
                      <Grid2 size={{ xs: 12, sm: 6 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Titular de la Cuenta
                          </Typography>
                          <Typography variant="body1" fontWeight={700} color="#1f2937">
                            {selectedDoctorBankAccount.accountHolder}
                          </Typography>
                        </Box>
                      </Grid2>
                    </Grid2>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ bgcolor: "#fef3c7", p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight={600} color="#92400e" gutterBottom>
                        Monto a Transferir:
                      </Typography>
                      <Typography variant="h5" fontWeight={700} color="#f59e0b">
                        {formatMoney(getDoctorPendingTotal(selectedDoctor))}
                      </Typography>
                    </Box>
                  </Paper>
                )}

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

        {/* Dialog de Confirmación de Pago */}
        <Dialog
          open={isPaymentConfirmDialogOpen}
          onClose={() => {
            setIsPaymentConfirmDialogOpen(false);
            setDoctorToPay(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                Confirmar Pago al Médico
              </Typography>
              <IconButton
                onClick={() => {
                  setIsPaymentConfirmDialogOpen(false);
                  setDoctorToPay(null);
                }}
              >
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {doctorToPay && (() => {
              const bankAccount = getDoctorBankAccount(doctorToPay);
              return (
                <Stack spacing={3}>
                  <Alert severity="info">
                    ¿Estás seguro de que deseas marcar todos los pagos pendientes de <strong>{doctorToPay}</strong> como pagados?
                  </Alert>
                  
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Resumen del pago:
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">Total a pagar:</Typography>
                          <Typography variant="body2" fontWeight={700} color="#10b981">
                            {formatMoney(getDoctorPendingTotal(doctorToPay))}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2">Pagos pendientes:</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {doctorTotals.get(doctorToPay)?.pendingCount || 0} citas
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Datos Bancarios */}
                  {bankAccount && (
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Datos bancarios para transferencia:
                      </Typography>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: "#fff7ed", border: "1px solid #fbbf24" }}>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" fontWeight={600}>Banco:</Typography>
                            <Typography variant="body2" fontWeight={700}>{bankAccount.bankName}</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" fontWeight={600}>Número de Cuenta:</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ fontFamily: "monospace" }}>
                              {bankAccount.accountNumber}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" fontWeight={600}>Tipo:</Typography>
                            <Typography variant="body2" fontWeight={700}>
                              {bankAccount.accountType === "checking" ? "Corriente" : "Ahorros"}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" fontWeight={600}>Titular:</Typography>
                            <Typography variant="body2" fontWeight={700}>{bankAccount.accountHolder}</Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Box>
                  )}

                  <Alert severity="warning">
                    Esta acción marcará todos los pagos pendientes como "Pagado". Asegúrate de haber realizado el pago externo (transferencia bancaria, etc.) antes de confirmar.
                  </Alert>
                </Stack>
              );
            })()}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setIsPaymentConfirmDialogOpen(false);
                setDoctorToPay(null);
              }}
              sx={{ textTransform: "none" }}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmPayment}
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              sx={{ textTransform: "none" }}
            >
              Confirmar Pago Realizado
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
        )}

        {/* Tab Content - Pagos a Clínicas */}
        {currentTab === 1 && (
          <Box>
            {/* Resumen de totales de clínicas */}
            <Grid2 container spacing={3} mb={4}>
              <Grid2 size={{ xs: 12, sm: 4 }}>
                <Card elevation={0} sx={{ bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <AttachMoney sx={{ color: "#14b8a6", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total a Clínicas
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#14b8a6">
                          {formatMoney(clinicPayments.reduce((sum, p) => sum + p.netAmount, 0))}
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
                          Pendientes
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#f59e0b">
                          {formatMoney(clinicPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netAmount, 0))}
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
                      <CheckCircle sx={{ color: "#10b981", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pagados
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#10b981">
                          {formatMoney(clinicPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netAmount, 0))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>

            {/* Tabla de Clínicas */}
            <Typography variant="h6" fontWeight={700} mb={2}>
              Clínicas con Pagos Pendientes
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f9fafb" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Clínica</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Citas
                    </TableCell>
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
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No hay pagos a clínicas registrados
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    clinicPayments.map((payment) => (
                      <TableRow key={payment.id} hover>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: "primary.light", width: 40, height: 40 }}>
                              <Business />
                            </Avatar>
                            <Typography fontWeight={600}>{payment.clinicName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={payment.appointments.length} color="primary" size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600}>{formatMoney(payment.totalAmount)}</Typography>
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
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => {
                                setSelectedClinic(payment);
                                setIsClinicDetailModalOpen(true);
                              }}
                            >
                              Ver Detalle
                            </Button>
                            {payment.status === 'pending' && (
                              <Button
                                variant="contained"
                                size="small"
                                color="success"
                                startIcon={<PaymentIcon />}
                                onClick={() => {
                                  setClinicToPay(payment);
                                  setIsClinicPaymentConfirmDialogOpen(true);
                                }}
                              >
                                Marcar como Pagado
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Modal de Detalle de Clínica */}
            <Dialog
              open={isClinicDetailModalOpen}
              onClose={() => {
                setIsClinicDetailModalOpen(false);
                setSelectedClinic(null);
              }}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Detalle de Pago - {selectedClinic?.clinicName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Citas incluidas en este pago
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => {
                      setIsClinicDetailModalOpen(false);
                      setSelectedClinic(null);
                    }}
                  >
                    <Close />
                  </IconButton>
                </Stack>
              </DialogTitle>
              <DialogContent>
                {selectedClinic && (
                  <Box>
                    {/* Resumen */}
                    <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
                      <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Cobrado
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="#14b8a6">
                            {formatMoney(selectedClinic.totalAmount)}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Typography variant="caption" color="text.secondary">
                            Comisión App (15%)
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="#f59e0b">
                            {formatMoney(selectedClinic.appCommission)}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Neto Clínica
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="#10b981">
                            {formatMoney(selectedClinic.netAmount)}
                          </Typography>
                        </Grid2>
                      </Grid2>
                    </Paper>

                    {/* Lista de Citas */}
                    <Typography variant="subtitle1" fontWeight={600} mb={2}>
                      Citas Incluidas
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f9fafb" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Médico</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Paciente</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">
                              Monto
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedClinic.appointments.map((apt) => (
                            <TableRow key={apt.id}>
                              <TableCell>{apt.doctorName}</TableCell>
                              <TableCell>{apt.patientName}</TableCell>
                              <TableCell>
                                {new Date(apt.date).toLocaleDateString('es-ES')}
                              </TableCell>
                              <TableCell align="right">
                                <Typography fontWeight={600}>
                                  {formatMoney(apt.amount)}
                                </Typography>
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

            {/* Dialog de Confirmación de Pago a Clínica */}
            <Dialog
              open={isClinicPaymentConfirmDialogOpen}
              onClose={() => {
                setIsClinicPaymentConfirmDialogOpen(false);
                setClinicToPay(null);
              }}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={700}>
                    Confirmar Pago a Clínica
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setIsClinicPaymentConfirmDialogOpen(false);
                      setClinicToPay(null);
                    }}
                  >
                    <Close />
                  </IconButton>
                </Stack>
              </DialogTitle>
              <DialogContent>
                {clinicToPay && (
                  <Stack spacing={3}>
                    <Alert severity="info">
                      ¿Estás seguro de que deseas marcar el pago a <strong>{clinicToPay.clinicName}</strong> como pagado?
                    </Alert>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Resumen del pago:
                      </Typography>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Total a pagar:</Typography>
                            <Typography variant="body2" fontWeight={700} color="#10b981">
                              {formatMoney(clinicToPay.netAmount)}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">Citas incluidas:</Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {clinicToPay.appointments.length} citas
                            </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Box>

                    <Alert severity="warning">
                      Esta acción marcará el pago como "Pagado". Asegúrate de haber realizado la transferencia bancaria antes de confirmar.
                    </Alert>
                  </Stack>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    setIsClinicPaymentConfirmDialogOpen(false);
                    setClinicToPay(null);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    if (clinicToPay) {
                      setClinicPayments(prev => {
                        const updated = prev.map(p => 
                          p.id === clinicToPay.id 
                            ? { ...p, status: 'paid' as const, paymentDate: new Date().toISOString() }
                            : p
                        );
                        localStorage.setItem("admin_clinic_payments", JSON.stringify(updated));
                        return updated;
                      });
                      setIsClinicPaymentConfirmDialogOpen(false);
                      setClinicToPay(null);
                    }
                  }}
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  sx={{ textTransform: "none" }}
                >
                  Confirmar Pago Realizado
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {/* Tab Content - Historial */}
        {currentTab === 2 && (
          <Box>
            {/* Resumen General */}
            <Grid2 container spacing={3} mb={4}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Card elevation={0} sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <LocalHospital sx={{ color: "#3b82f6", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Pagado a Médicos
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#3b82f6">
                          {formatMoney(payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netAmount, 0))}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payments.filter(p => p.status === 'paid').length} pagos
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Card elevation={0} sx={{ bgcolor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Business sx={{ color: "#22c55e", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Pagado a Clínicas
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#22c55e">
                          {formatMoney(clinicPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netAmount, 0))}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {clinicPayments.filter(p => p.status === 'paid').length} pagos
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>

            {/* Historial Combinado */}
            <Typography variant="h6" fontWeight={700} mb={2}>
              Historial de Pagos Realizados
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f9fafb" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Beneficiario</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Fecha de Pago</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Monto Pagado
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Pagos a Médicos */}
                  {payments
                    .filter(p => p.status === 'paid')
                    .map((payment) => (
                      <TableRow key={`doctor-${payment.id}`} hover>
                        <TableCell>
                          <Chip
                            icon={<LocalHospital />}
                            label="Médico"
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: "primary.light", width: 32, height: 32 }}>
                              {payment.providerName.charAt(0)}
                            </Avatar>
                            <Typography fontWeight={600}>{payment.providerName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {new Date(payment.date).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600} color="#10b981">
                            {formatMoney(payment.netAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={<CheckCircle />}
                            label="Pagado"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  
                  {/* Pagos a Clínicas */}
                  {clinicPayments
                    .filter(p => p.status === 'paid')
                    .map((payment) => (
                      <TableRow key={`clinic-${payment.id}`} hover>
                        <TableCell>
                          <Chip
                            icon={<Business />}
                            label="Clínica"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: "success.light", width: 32, height: 32 }}>
                              <Business />
                            </Avatar>
                            <Typography fontWeight={600}>{payment.clinicName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {payment.paymentDate 
                            ? new Date(payment.paymentDate).toLocaleDateString('es-ES')
                            : '-'}
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600} color="#10b981">
                            {formatMoney(payment.netAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={<CheckCircle />}
                            label="Pagado"
                            color="success"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}

                  {payments.filter(p => p.status === 'paid').length === 0 && 
                   clinicPayments.filter(p => p.status === 'paid').length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No hay pagos realizados en el historial
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        </>
        )}
      </Box>
    </DashboardLayout>
  );
};

