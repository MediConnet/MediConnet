import { AttachMoney, CreditCard, Visibility, CheckCircle, Payment as PaymentIcon, AccountBalance, Business, LocalHospital, History, Refresh, Download, Close } from "@mui/icons-material";
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
  IconButton,
  Stack,
  Typography,
  Paper,
  Alert,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useMemo, useEffect, useCallback } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { DataTable, TableToolbar } from "../../../../shared/components/DataTable";
import { formatMoney } from "../../../../shared/lib/formatMoney";
import { getUserFriendlyMessage } from "../../../../shared/lib/api-error";
import { useFeedbackStore } from "../../../../app/store/feedback.store";
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

  // Paginación de tablas
  const [doctorGroupPagination, setDoctorGroupPagination] = useState({ page: 0, pageSize: 10 });
  const [detailPagination, setDetailPagination] = useState({ page: 0, pageSize: 10 });
  const [clinicPagination, setClinicPagination] = useState({ page: 0, pageSize: 10 });
  const [historyPagination, setHistoryPagination] = useState({ page: 0, pageSize: 10 });

  // Estados para clínicas
  const [clinicPayments, setClinicPayments] = useState<AdminClinicPayment[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<AdminClinicPayment | null>(null);
  const [isClinicDetailModalOpen, setIsClinicDetailModalOpen] = useState(false);
  const [isClinicPaymentConfirmDialogOpen, setIsClinicPaymentConfirmDialogOpen] = useState(false);
  const [clinicToPay, setClinicToPay] = useState<AdminClinicPayment | null>(null);
  const [doctorToPay, setDoctorToPay] = useState<string | null>(null);
  const feedback = useFeedbackStore();

  // Cargar pagos desde la API
  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const [doctorPaymentsData, clinicPaymentsData] = await Promise.all([
          getAdminDoctorPaymentsAPI({ page: 1, limit: 1000 }),
          getAdminClinicPaymentsAPI({ page: 1, limit: 1000 })
        ]);
        setPayments(doctorPaymentsData.data);
        setClinicPayments(clinicPaymentsData.data);
      } catch (err: any) {
        setError(getUserFriendlyMessage(err, { fallback: 'No fue posible cargar los pagos.' }));
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
      feedback.showFeedback('error', 'Error', getUserFriendlyMessage(err, { fallback: 'No fue posible marcar los pagos como pagados.' }));
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
    const paymentWithBank = payments.find(
      (p) => p.providerName === selectedDoctor && p.doctorBankAccount
    );
    if (paymentWithBank?.doctorBankAccount) {
      return paymentWithBank.doctorBankAccount;
    }
    return getDoctorBankAccount(selectedDoctor);
  }, [selectedDoctor, payments]);

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

  // ── Columnas: Médicos agrupados ────────────────────────────────────────────
  interface DoctorGroupRow {
    id: string;
    doctorName: string;
    count: number;
    totalAmount: number;
    totalCommission: number;
    totalNet: number;
    pendingCount: number;
    pendingTotal: number;
  }

  const doctorGroupRows: DoctorGroupRow[] = useMemo(() => {
    const allDoctors = Array.from(new Set(payments.map((p) => p.providerName)));
    return allDoctors.map((doctorName) => {
      const t = doctorTotals.get(doctorName) || { totalAmount: 0, totalCommission: 0, totalNet: 0, count: 0, pendingCount: 0 };
      return {
        id: doctorName,
        doctorName,
        count: t.count,
        totalAmount: t.totalAmount,
        totalCommission: t.totalCommission,
        totalNet: t.totalNet,
        pendingCount: t.pendingCount,
        pendingTotal: getDoctorPendingTotal(doctorName),
      };
    });
  }, [payments, doctorTotals]);

  const doctorGroupColumns = useMemo(() => [
    {
      field: "doctorName",
      headerName: "Médico",
      flex: 1,
      minWidth: 200,
      renderCell: (params: { row: DoctorGroupRow }) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.light", width: 36, height: 36 }}>
            {params.row.doctorName.charAt(0)}
          </Avatar>
          <Typography fontWeight={600}>{params.row.doctorName}</Typography>
        </Stack>
      ),
    },
    {
      field: "count",
      headerName: "Pagos",
      width: 100,
      renderCell: (params: { row: DoctorGroupRow }) => (
        <Chip label={params.row.count} color="primary" size="small" />
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total Cobrado",
      width: 140,
      renderCell: (params: { row: DoctorGroupRow }) => (
        <Typography fontWeight={600}>{formatMoney(params.row.totalAmount)}</Typography>
      ),
    },
    {
      field: "totalCommission",
      headerName: "Comisión",
      width: 120,
      renderCell: (params: { row: DoctorGroupRow }) => (
        <Typography color="text.secondary">{formatMoney(params.row.totalCommission)}</Typography>
      ),
    },
    {
      field: "totalNet",
      headerName: "Total Neto",
      width: 140,
      renderCell: (params: { row: DoctorGroupRow }) => (
        <Box>
          <Typography fontWeight={600} color="#10b981">{formatMoney(params.row.totalNet)}</Typography>
          {params.row.pendingCount > 0 && (
            <Typography variant="caption" color="warning.main" fontWeight={600}>
              {formatMoney(params.row.pendingTotal)} pendiente
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 240,
      renderCell: (params: { row: DoctorGroupRow }) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined" size="small" startIcon={<Visibility />}
            onClick={() => { setSelectedDoctor(params.row.doctorName); setIsDetailModalOpen(true); }}
            sx={{ textTransform: "none" }}
          >
            Ver Detalle
          </Button>
          {params.row.pendingCount > 0 && (
            <Button
              variant="contained" size="small" color="success" startIcon={<PaymentIcon />}
              onClick={() => handleMarkAsPaid(params.row.doctorName)}
              sx={{ textTransform: "none" }}
            >
              Pagar
            </Button>
          )}
        </Stack>
      ),
    },
  ], []);

  // ── Columnas: Detalle de Pagos a Médicos ───────────────────────────────────
  const detailColumns = useMemo(() => [
    {
      field: "providerName",
      headerName: "Médico",
      flex: 1,
      minWidth: 180,
      renderCell: (params: { row: AdminDoctorPayment }) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.light", width: 32, height: 32 }}>
            {params.row.providerName.charAt(0)}
          </Avatar>
          <Typography fontWeight={600}>{params.row.providerName}</Typography>
        </Stack>
      ),
    },
    {
      field: "date",
      headerName: "Fecha",
      width: 120,
      renderCell: (params: { row: AdminDoctorPayment }) => (
        <Typography>{new Date(params.row.date).toLocaleDateString("es-ES")}</Typography>
      ),
    },
    {
      field: "amount",
      headerName: "Monto Cobrado",
      width: 130,
      renderCell: (params: { row: AdminDoctorPayment }) => (
        <Typography fontWeight={600}>{formatMoney(params.row.amount)}</Typography>
      ),
    },
    {
      field: "commission",
      headerName: "Comisión (15%)",
      width: 130,
      renderCell: (params: { row: AdminDoctorPayment }) => (
        <Typography color="text.secondary">{formatMoney(params.row.commission)}</Typography>
      ),
    },
    {
      field: "netAmount",
      headerName: "Total Neto",
      width: 130,
      renderCell: (params: { row: AdminDoctorPayment }) => (
        <Typography fontWeight={600} color="#10b981">{formatMoney(params.row.netAmount)}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 110,
      renderCell: (params: { row: AdminDoctorPayment }) => (
        <Chip
          label={params.row.status === "paid" ? "Pagado" : "Pendiente"}
          color={params.row.status === "paid" ? "success" : "warning"}
          size="small"
        />
      ),
    },
  ], []);

  // ── Columnas: Clínicas ───────────────────────────────────────────────────
  const clinicColumns = useMemo(() => [
    {
      field: "clinicName",
      headerName: "Clínica",
      flex: 1,
      minWidth: 200,
      renderCell: (params: { row: AdminClinicPayment }) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.light", width: 36, height: 36 }}>
            <Business />
          </Avatar>
          <Typography fontWeight={600}>{params.row.clinicName}</Typography>
        </Stack>
      ),
    },
    {
      field: "appointments",
      headerName: "Citas",
      width: 80,
      renderCell: (params: { row: AdminClinicPayment }) => (
        <Chip label={params.row.appointments.length} color="primary" size="small" />
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total Cobrado",
      width: 140,
      renderCell: (params: { row: AdminClinicPayment }) => (
        <Typography fontWeight={600}>{formatMoney(params.row.totalAmount)}</Typography>
      ),
    },
    {
      field: "appCommission",
      headerName: "Comisión App",
      width: 120,
      renderCell: (params: { row: AdminClinicPayment }) => (
        <Typography color="text.secondary">{formatMoney(params.row.appCommission)}</Typography>
      ),
    },
    {
      field: "netAmount",
      headerName: "Total Neto",
      width: 140,
      renderCell: (params: { row: AdminClinicPayment }) => (
        <Typography fontWeight={600} color="#10b981">{formatMoney(params.row.netAmount)}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 110,
      renderCell: (params: { row: AdminClinicPayment }) => (
        <Chip
          label={params.row.status === "paid" ? "Pagado" : "Pendiente"}
          color={params.row.status === "paid" ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 240,
      renderCell: (params: { row: AdminClinicPayment }) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined" size="small" startIcon={<Visibility />}
            onClick={() => { setSelectedClinic(params.row); setIsClinicDetailModalOpen(true); }}
            sx={{ textTransform: "none" }}
          >
            Ver Detalle
          </Button>
          {params.row.status === "pending" && (
            <Button
              variant="contained" size="small" color="success" startIcon={<PaymentIcon />}
              onClick={() => { setClinicToPay(params.row); setIsClinicPaymentConfirmDialogOpen(true); }}
              sx={{ textTransform: "none" }}
            >
              Pagar
            </Button>
          )}
        </Stack>
      ),
    },
  ], []);

  // ── Columnas y filas: Historial ───────────────────────────────────────────
  interface HistoryRow {
    id: string;
    type: "doctor" | "clinic";
    beneficiary: string;
    paymentDate: string;
    netAmount: number;
    avatarChar: string;
  }

  const historyRows: HistoryRow[] = useMemo(() => {
    const doctorHistory = payments
      .filter((p) => p.status === "paid")
      .map((p) => ({
        id: `doctor-${p.id}`,
        type: "doctor" as const,
        beneficiary: p.providerName,
        paymentDate: p.date,
        netAmount: p.netAmount,
        avatarChar: p.providerName.charAt(0),
      }));
    const clinicHistory = clinicPayments
      .filter((p) => p.status === "paid")
      .map((p) => ({
        id: `clinic-${p.id}`,
        type: "clinic" as const,
        beneficiary: p.clinicName,
        paymentDate: p.paymentDate || p.date,
        netAmount: p.netAmount,
        avatarChar: p.clinicName.charAt(0),
      }));
    return [...doctorHistory, ...clinicHistory].sort(
      (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
  }, [payments, clinicPayments]);

  const historyColumns = useMemo(() => [
    {
      field: "type",
      headerName: "Tipo",
      width: 110,
      renderCell: (params: { row: HistoryRow }) => (
        <Chip
          icon={params.row.type === "doctor" ? <LocalHospital /> : <Business />}
          label={params.row.type === "doctor" ? "Médico" : "Clínica"}
          size="small"
          color={params.row.type === "doctor" ? "primary" : "success"}
          variant="outlined"
        />
      ),
    },
    {
      field: "beneficiary",
      headerName: "Beneficiario",
      flex: 1,
      minWidth: 200,
      renderCell: (params: { row: HistoryRow }) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              bgcolor: params.row.type === "doctor" ? "primary.light" : "success.light",
              width: 32, height: 32,
            }}
          >
            {params.row.type === "doctor" ? params.row.avatarChar : <Business />}
          </Avatar>
          <Typography fontWeight={600}>{params.row.beneficiary}</Typography>
        </Stack>
      ),
    },
    {
      field: "paymentDate",
      headerName: "Fecha de Pago",
      width: 130,
      renderCell: (params: { row: HistoryRow }) => (
        <Typography>{new Date(params.row.paymentDate).toLocaleDateString("es-ES")}</Typography>
      ),
    },
    {
      field: "netAmount",
      headerName: "Monto Pagado",
      width: 130,
      renderCell: (params: { row: HistoryRow }) => (
        <Typography fontWeight={600} color="#10b981">{formatMoney(params.row.netAmount)}</Typography>
      ),
    },
    {
      field: "statusDisplay",
      headerName: "Estado",
      width: 110,
      renderCell: () => (
        <Chip icon={<CheckCircle />} label="Pagado" color="success" size="small" />
      ),
    },
  ], []);

  const handleRefresh = useCallback(() => {
    const loadPayments = async () => {
      setLoading(true);
      try {
        const [doctorPaymentsData, clinicPaymentsData] = await Promise.all([
          getAdminDoctorPaymentsAPI({ page: 1, limit: 1000 }),
          getAdminClinicPaymentsAPI({ page: 1, limit: 1000 })
        ]);
        setPayments(doctorPaymentsData.data);
        setClinicPayments(clinicPaymentsData.data);
      } catch (err: any) {
        setError(getUserFriendlyMessage(err, { fallback: 'No fue posible cargar los pagos.' }));
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const handleExportHistory = () => {
    const csvContent = [
      ["Tipo", "Beneficiario", "Fecha de Pago", "Monto Pagado", "Estado"].join(","),
      ...historyRows.map((r) =>
        [r.type === "doctor" ? "Médico" : "Clínica", r.beneficiary, new Date(r.paymentDate).toLocaleDateString("es-ES"), r.netAmount, "Pagado"].join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historial-pagos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

            {/* Toolbar + DataTable: Médicos con Pagos con Tarjeta */}
            <TableToolbar
              title="Médicos con Pagos con Tarjeta"
              searchValue={doctorFilter === "all" ? "" : doctorFilter}
              searchPlaceholder="Filtrar por médico..."
              onSearchChange={(v) => { setDoctorFilter(v || "all"); setDoctorGroupPagination((p) => ({ ...p, page: 0 })); }}
              filters={[
                {
                  key: "status",
                  label: "Estado",
                  value: statusFilter,
                  onChange: (v) => { setStatusFilter(v as any); setDoctorGroupPagination((p) => ({ ...p, page: 0 })); },
                  options: [
                    { value: "all", label: "Todos" },
                    { value: "pending", label: "Pendientes" },
                    { value: "paid", label: "Pagados" },
                  ],
                },
              ]}
              actions={[
                { label: "Refrescar", icon: <Refresh />, onClick: handleRefresh, variant: "outlined" },
              ]}
              sx={{ mb: 2 }}
            />
            <Box mb={4}>
              <DataTable
                rows={(() => {
                  const all = Array.from(doctorGroupRows);
                  const start = doctorGroupPagination.page * doctorGroupPagination.pageSize;
                  return all.slice(start, start + doctorGroupPagination.pageSize);
                })()}
                columns={doctorGroupColumns}
                getRowId={(row) => row.id}
                rowCount={doctorGroupRows.length}
                paginationModel={doctorGroupPagination}
                onPaginationModelChange={setDoctorGroupPagination}
                pageSizeOptions={[5, 10, 20]}
                rowHeight={64}
                emptyTitle="Sin médicos con pagos"
                emptyDescription="No hay médicos con pagos registrados."
              />
            </Box>

            {/* Toolbar + DataTable: Detalle de Pagos */}
            <TableToolbar
              title="Detalle de Pagos"
              searchValue={doctorFilter === "all" ? "" : doctorFilter}
              searchPlaceholder="Filtrar por médico..."
              onSearchChange={(v) => { setDoctorFilter(v || "all"); setDetailPagination((p) => ({ ...p, page: 0 })); }}
              sx={{ mb: 2 }}
            />
            <Box mb={4}>
              <DataTable
                rows={(() => {
                  const start = detailPagination.page * detailPagination.pageSize;
                  return filteredPayments.slice(start, start + detailPagination.pageSize);
                })()}
                columns={detailColumns}
                getRowId={(row) => row.id}
                rowCount={filteredPayments.length}
                paginationModel={detailPagination}
                onPaginationModelChange={setDetailPagination}
                pageSizeOptions={[5, 10, 20]}
                rowHeight={64}
                emptyTitle="Sin pagos registrados"
                emptyDescription="No hay pagos que coincidan con los filtros aplicados."
              />
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
                    <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
                      <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Total Cobrado</Typography>
                            <Typography variant="h6" fontWeight={700} color="#14b8a6">
                              {formatMoney(doctorTotals.get(selectedDoctor)?.totalAmount || 0)}
                            </Typography>
                          </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Total Comisión (15%)</Typography>
                            <Typography variant="h6" fontWeight={700} color="#f59e0b">
                              {formatMoney(doctorTotals.get(selectedDoctor)?.totalCommission || 0)}
                            </Typography>
                          </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Total Neto del Médico</Typography>
                            <Typography variant="h6" fontWeight={700} color="#10b981">
                              {formatMoney(doctorTotals.get(selectedDoctor)?.totalNet || 0)}
                            </Typography>
                          </Box>
                        </Grid2>
                      </Grid2>
                    </Paper>

                    {selectedDoctorBankAccount && (
                      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#fff7ed", border: "2px solid #fbbf24", borderRadius: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                          <AccountBalance sx={{ color: "#f59e0b", fontSize: 24 }} />
                          <Typography variant="h6" fontWeight={700} color="#f59e0b">Datos Bancarios para Transferencia</Typography>
                        </Stack>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Utiliza esta información para realizar la transferencia externa al médico.
                        </Alert>
                        <Grid2 container spacing={2}>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Banco</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedDoctorBankAccount.bankName}</Typography>
                            </Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Número de Cuenta</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937" sx={{ fontFamily: "monospace" }}>{selectedDoctorBankAccount.accountNumber}</Typography>
                            </Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Tipo de Cuenta</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937">
                                {selectedDoctorBankAccount.accountType === "checking" || selectedDoctorBankAccount.accountType === "Corriente" ? "Corriente" : "Ahorros"}
                              </Typography>
                            </Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Titular de la Cuenta</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedDoctorBankAccount.accountHolder}</Typography>
                            </Box>
                          </Grid2>
                          {selectedDoctorBankAccount.identificationNumber && (
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>RUC / Cédula</Typography>
                                <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedDoctorBankAccount.identificationNumber}</Typography>
                              </Box>
                            </Grid2>
                          )}
                          {selectedDoctorBankAccount.email && (
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Correo Electrónico</Typography>
                                <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedDoctorBankAccount.email}</Typography>
                              </Box>
                            </Grid2>
                          )}
                        </Grid2>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ bgcolor: "#fef3c7", p: 2, borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight={600} color="#92400e" gutterBottom>Monto a Transferir:</Typography>
                          <Typography variant="h5" fontWeight={700} color="#f59e0b">{formatMoney(getDoctorPendingTotal(selectedDoctor))}</Typography>
                        </Box>
                      </Paper>
                    )}

                    <Typography variant="subtitle1" fontWeight={600} mb={2}>Pagos Individuales</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow sx={{ bgcolor: "#f9fafb" }}>
                            <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Monto Cobrado</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Comisión</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Neto</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">Estado</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedDoctorPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>{new Date(payment.date).toLocaleDateString("es-ES")}</TableCell>
                              <TableCell align="right"><Typography fontWeight={600}>{formatMoney(payment.amount)}</Typography></TableCell>
                              <TableCell align="right"><Typography color="text.secondary">{formatMoney(payment.commission)}</Typography></TableCell>
                              <TableCell align="right"><Typography fontWeight={600} color="#10b981">{formatMoney(payment.netAmount)}</Typography></TableCell>
                              <TableCell align="center">
                                <Chip label={payment.status === "paid" ? "Pagado" : "Pendiente"} color={payment.status === "paid" ? "success" : "warning"} size="small" />
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
              onClose={() => { setIsPaymentConfirmDialogOpen(false); setDoctorToPay(null); }}
              maxWidth="sm" fullWidth
            >
              <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={700}>Confirmar Pago al Médico</Typography>
                  <IconButton onClick={() => { setIsPaymentConfirmDialogOpen(false); setDoctorToPay(null); }}><Close /></IconButton>
                </Stack>
              </DialogTitle>
              <DialogContent>
                {doctorToPay && (() => {
                  const paymentWithBank = payments.find(
                    (p) => p.providerName === doctorToPay && p.doctorBankAccount
                  );
                  const bankAccount = paymentWithBank?.doctorBankAccount || getDoctorBankAccount(doctorToPay);
                  return (
                    <Stack spacing={3}>
                      <Alert severity="info">¿Estás seguro de que deseas marcar todos los pagos pendientes de <strong>{doctorToPay}</strong> como pagados?</Alert>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Resumen del pago:</Typography>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Total a pagar:</Typography>
                              <Typography variant="body2" fontWeight={700} color="#10b981">{formatMoney(getDoctorPendingTotal(doctorToPay))}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Pagos pendientes:</Typography>
                              <Typography variant="body2" fontWeight={600}>{doctorTotals.get(doctorToPay)?.pendingCount || 0} citas</Typography>
                            </Stack>
                          </Stack>
                        </Paper>
                      </Box>
                      {bankAccount && (
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Datos bancarios para transferencia:</Typography>
                          <Paper elevation={0} sx={{ p: 2, bgcolor: "#fff7ed", border: "1px solid #fbbf24" }}>
                            <Stack spacing={1}>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" fontWeight={600}>Banco:</Typography>
                                <Typography variant="body2" fontWeight={700}>{bankAccount.bankName}</Typography>
                              </Stack>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" fontWeight={600}>Número de Cuenta:</Typography>
                                <Typography variant="body2" fontWeight={700} sx={{ fontFamily: "monospace" }}>{bankAccount.accountNumber}</Typography>
                              </Stack>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" fontWeight={600}>Tipo:</Typography>
                                <Typography variant="body2" fontWeight={700}>
                                  {bankAccount.accountType === "checking" || bankAccount.accountType === "Corriente" ? "Corriente" : "Ahorros"}
                                </Typography>
                              </Stack>
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" fontWeight={600}>Titular:</Typography>
                                <Typography variant="body2" fontWeight={700}>{bankAccount.accountHolder}</Typography>
                              </Stack>
                              {bankAccount.identificationNumber && (
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2" fontWeight={600}>RUC / Cédula:</Typography>
                                  <Typography variant="body2" fontWeight={700}>{bankAccount.identificationNumber}</Typography>
                                </Stack>
                              )}
                              {bankAccount.email && (
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="body2" fontWeight={600}>Correo:</Typography>
                                  <Typography variant="body2" fontWeight={700}>{bankAccount.email}</Typography>
                                </Stack>
                              )}
                            </Stack>
                          </Paper>
                        </Box>
                      )}
                      <Alert severity="warning">Esta acción marcará todos los pagos pendientes como "Pagado". Asegúrate de haber realizado el pago externo (transferencia bancaria, etc.) antes de confirmar.</Alert>
                    </Stack>
                  );
                })()}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { setIsPaymentConfirmDialogOpen(false); setDoctorToPay(null); }} sx={{ textTransform: "none" }}>Cancelar</Button>
                <Button onClick={confirmPayment} variant="contained" color="success" startIcon={<CheckCircle />} sx={{ textTransform: "none" }}>Confirmar Pago Realizado</Button>
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

            {/* Toolbar + DataTable: Clínicas */}
            <TableToolbar
              title="Clínicas con Pagos Pendientes"
              actions={[
                { label: "Refrescar", icon: <Refresh />, onClick: handleRefresh, variant: "outlined" },
              ]}
              sx={{ mb: 2 }}
            />
            <Box mb={4}>
              <DataTable
                rows={(() => {
                  const start = clinicPagination.page * clinicPagination.pageSize;
                  return clinicPayments.slice(start, start + clinicPagination.pageSize);
                })()}
                columns={clinicColumns}
                getRowId={(row) => row.id}
                rowCount={clinicPayments.length}
                paginationModel={clinicPagination}
                onPaginationModelChange={setClinicPagination}
                pageSizeOptions={[5, 10, 20]}
                rowHeight={64}
                emptyTitle="Sin pagos a clínicas"
                emptyDescription="No hay pagos a clínicas registrados."
              />
            </Box>

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

                    {selectedClinic.clinicBankAccount && (
                      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#fff7ed", border: "2px solid #fbbf24", borderRadius: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                          <AccountBalance sx={{ color: "#f59e0b", fontSize: 24 }} />
                          <Typography variant="h6" fontWeight={700} color="#f59e0b">Datos Bancarios para Transferencia</Typography>
                        </Stack>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Utiliza esta información para realizar la transferencia externa a la clínica.
                        </Alert>
                        <Grid2 container spacing={2}>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Banco</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedClinic.clinicBankAccount.bankName}</Typography>
                            </Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Número de Cuenta</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937" sx={{ fontFamily: "monospace" }}>{selectedClinic.clinicBankAccount.accountNumber}</Typography>
                            </Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Tipo de Cuenta</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937">
                                {selectedClinic.clinicBankAccount.accountType === "checking" || selectedClinic.clinicBankAccount.accountType === "Corriente" ? "Corriente" : "Ahorros"}
                              </Typography>
                            </Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Titular de la Cuenta</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedClinic.clinicBankAccount.accountHolder}</Typography>
                            </Box>
                          </Grid2>
                          {selectedClinic.clinicBankAccount.identificationNumber && (
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>RUC / Cédula</Typography>
                                <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedClinic.clinicBankAccount.identificationNumber}</Typography>
                              </Box>
                            </Grid2>
                          )}
                          {selectedClinic.clinicBankAccount.email && (
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Correo Electrónico</Typography>
                                <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedClinic.clinicBankAccount.email}</Typography>
                              </Box>
                            </Grid2>
                          )}
                        </Grid2>
                      </Paper>
                    )}

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

                    {clinicToPay.clinicBankAccount && (
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Datos bancarios para transferencia:</Typography>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: "#fff7ed", border: "1px solid #fbbf24" }}>
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" fontWeight={600}>Banco:</Typography>
                              <Typography variant="body2" fontWeight={700}>{clinicToPay.clinicBankAccount.bankName}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" fontWeight={600}>Número de Cuenta:</Typography>
                              <Typography variant="body2" fontWeight={700} sx={{ fontFamily: "monospace" }}>{clinicToPay.clinicBankAccount.accountNumber}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" fontWeight={600}>Tipo:</Typography>
                              <Typography variant="body2" fontWeight={700}>
                                {clinicToPay.clinicBankAccount.accountType === "checking" || clinicToPay.clinicBankAccount.accountType === "Corriente" ? "Corriente" : "Ahorros"}
                              </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2" fontWeight={600}>Titular:</Typography>
                              <Typography variant="body2" fontWeight={700}>{clinicToPay.clinicBankAccount.accountHolder}</Typography>
                            </Stack>
                            {clinicToPay.clinicBankAccount.identificationNumber && (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" fontWeight={600}>RUC / Cédula:</Typography>
                                <Typography variant="body2" fontWeight={700}>{clinicToPay.clinicBankAccount.identificationNumber}</Typography>
                              </Stack>
                            )}
                            {clinicToPay.clinicBankAccount.email && (
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" fontWeight={600}>Correo:</Typography>
                                <Typography variant="body2" fontWeight={700}>{clinicToPay.clinicBankAccount.email}</Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Paper>
                      </Box>
                    )}

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
                  onClick={async () => {
                    if (!clinicToPay) return;
                    try {
                      await markClinicPaymentAsPaidAPI(clinicToPay.id);
                      setClinicPayments((prev) =>
                        prev.map((p) =>
                          p.id === clinicToPay.id
                            ? { ...p, status: "paid" as const, paymentDate: new Date().toISOString() }
                            : p
                        )
                      );
                      setIsClinicPaymentConfirmDialogOpen(false);
                      setClinicToPay(null);
                    } catch (err: any) {
                      feedback.showFeedback('error', 'Error', getUserFriendlyMessage(err, { fallback: "No fue posible marcar el pago como pagado." }));
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

            {/* Toolbar + DataTable: Historial */}
            <TableToolbar
              title="Historial de Pagos Realizados"
              actions={[
                { label: "Exportar", icon: <Download />, onClick: handleExportHistory, variant: "outlined" },
                { label: "Refrescar", icon: <Refresh />, onClick: handleRefresh, variant: "outlined" },
              ]}
              sx={{ mb: 2 }}
            />
            <DataTable
              rows={(() => {
                const start = historyPagination.page * historyPagination.pageSize;
                return historyRows.slice(start, start + historyPagination.pageSize);
              })()}
              columns={historyColumns}
              getRowId={(row) => row.id}
              rowCount={historyRows.length}
              paginationModel={historyPagination}
              onPaginationModelChange={setHistoryPagination}
              pageSizeOptions={[5, 10, 20]}
              rowHeight={64}
              emptyTitle="Sin historial de pagos"
              emptyDescription="No hay pagos realizados registrados en el historial."
            />
          </Box>
        )}
        </>
        )}
      </Box>
    </DashboardLayout>
  );
};

