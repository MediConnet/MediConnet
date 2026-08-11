import { AttachMoney, CreditCard, Visibility, CheckCircle, Payment as PaymentIcon, AccountBalance, Business, LocalHospital, History, Refresh, Download, Close, Undo, Spa } from "@mui/icons-material";
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
  getAdminAestheticPaymentsAPI,
  getAdminClinicPaymentsAPI,
  markDoctorPaymentsAsPaidAPI,
  markAestheticPaymentsAsPaidAPI,
  markClinicPaymentAsPaidAPI,
  getAdminTransactionsAPI,
  getAdminRefundRequestsAPI,
  approveAdminRefundAPI,
  rejectAdminRefundAPI,
  type AdminDoctorPayment,
  type AdminAestheticPayment,
  type AdminClinicPayment,
  type AdminTransaction,
  type AdminRefundRequest
} from "../../infrastructure/admin-payments.api";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

const getStatusChipProps = (status: string) => {
  const norm = (status || '').toUpperCase();
  if (['PAID', 'COMPLETED', 'SUCCESS'].includes(norm)) {
    return { label: 'Completado', color: 'success' as const };
  }
  if (['REFUNDED'].includes(norm)) {
    return { label: 'Reembolsado', color: 'error' as const };
  }
  if (['REFUND_REQUESTED'].includes(norm)) {
    return { label: 'Reembolso Solicitado', color: 'warning' as const };
  }
  if (['CANCELLED', 'CANCELED'].includes(norm)) {
    return { label: 'Cancelado', color: 'default' as const };
  }
  if (['FAILED'].includes(norm)) {
    return { label: 'Fallido', color: 'error' as const };
  }
  if (['PENDING'].includes(norm)) {
    return { label: 'Pendiente', color: 'info' as const };
  }
  return { label: status, color: 'warning' as const };
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

  // Estados para centros estéticos (mismo patrón que médicos)
  const [aestheticPayments, setAestheticPayments] = useState<AdminAestheticPayment[]>([]);
  const [aestheticStatusFilter, setAestheticStatusFilter] = useState<"all" | "pending" | "paid">("all");
  const [aestheticFilter, setAestheticFilter] = useState<string>("all");
  const [selectedAesthetic, setSelectedAesthetic] = useState<string | null>(null);
  const [isAestheticDetailModalOpen, setIsAestheticDetailModalOpen] = useState(false);
  const [isAestheticPaymentConfirmDialogOpen, setIsAestheticPaymentConfirmDialogOpen] = useState(false);
  const [aestheticToPay, setAestheticToPay] = useState<string | null>(null);
  const [aestheticGroupPagination, setAestheticGroupPagination] = useState({ page: 0, pageSize: 10 });
  const [aestheticDetailPagination, setAestheticDetailPagination] = useState({ page: 0, pageSize: 10 });

  // Estados para clínicas
  const [clinicPayments, setClinicPayments] = useState<AdminClinicPayment[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<AdminClinicPayment | null>(null);
  const [isClinicDetailModalOpen, setIsClinicDetailModalOpen] = useState(false);
  const [isClinicPaymentConfirmDialogOpen, setIsClinicPaymentConfirmDialogOpen] = useState(false);
  const [clinicToPay, setClinicToPay] = useState<AdminClinicPayment | null>(null);
  const [doctorToPay, setDoctorToPay] = useState<string | null>(null);
  const [clinicStatusFilter, setClinicStatusFilter] = useState<"all" | "pending" | "paid">("all");
  const [clinicSearchFilter, setClinicSearchFilter] = useState<string>("all");
  
  // Estados para Auditoría de Transacciones (Nuvei)
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [transactionsTotal, setTransactionsTotal] = useState(0);
  const [transactionsPagination, setTransactionsPagination] = useState({ page: 0, pageSize: 10 });
  const [transactionsSearch, setTransactionsSearch] = useState("");
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<AdminTransaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  // Clave de refresco: incrementarla fuerza el useEffect a re-ejecutarse aunque los demás valores no cambien
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);

  // Estados para Solicitudes de Reembolso
  const [refundRequests, setRefundRequests] = useState<AdminRefundRequest[]>([]);
  const [loadingRefunds, setLoadingRefunds] = useState(false);
  const [refundsRefreshKey, setRefundsRefreshKey] = useState(0);

  const feedback = useFeedbackStore();

  // Cargar pagos desde la API
  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const [doctorPaymentsData, aestheticPaymentsData, clinicPaymentsData] = await Promise.all([
          getAdminDoctorPaymentsAPI({ page: 1, limit: 1000 }),
          getAdminAestheticPaymentsAPI({ page: 1, limit: 1000 }),
          getAdminClinicPaymentsAPI({ page: 1, limit: 1000 })
        ]);
        setPayments(doctorPaymentsData.data);
        setAestheticPayments(aestheticPaymentsData.data);
        setClinicPayments(clinicPaymentsData.data);
      } catch (err: any) {
        setError(getUserFriendlyMessage(err, { fallback: 'No fue posible cargar los pagos.' }));
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  // Cargar solicitudes de reembolso desde la API
  useEffect(() => {
    if (currentTab !== 2) return;
    const fetchRefundRequests = async () => {
      setLoadingRefunds(true);
      try {
        const res = await getAdminRefundRequestsAPI();
        setRefundRequests(res);
      } catch (err: any) {
        feedback.showFeedback('error', 'Error', 'No se pudieron cargar las solicitudes de reembolso.');
      } finally {
        setLoadingRefunds(false);
      }
    };
    fetchRefundRequests();
  }, [currentTab, refundsRefreshKey, feedback]);

  // Cargar transacciones de auditoría desde la API
  useEffect(() => {
    if (currentTab !== 3) return;
    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      try {
        const res = await getAdminTransactionsAPI({
          page: transactionsPagination.page + 1,
          limit: transactionsPagination.pageSize,
          search: transactionsSearch || undefined,
        });
        setTransactions(res.data);
        setTransactionsTotal(res.pagination.total);
      } catch (err: any) {
        feedback.showFeedback('error', 'Error', 'No se pudieron cargar las transacciones para auditoría.');
      } finally {
        setLoadingTransactions(false);
      }
    };
    fetchTransactions();
  }, [currentTab, transactionsPagination.page, transactionsPagination.pageSize, transactionsSearch, transactionsRefreshKey, feedback]);

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

    if (doctorFilter !== "all" && doctorFilter.trim() !== "") {
      filtered = filtered.filter((p) => 
        p.providerName.toLowerCase().includes(doctorFilter.toLowerCase()) ||
        p.patientName.toLowerCase().includes(doctorFilter.toLowerCase())
      );
    }

    return filtered;
  }, [payments, statusFilter, doctorFilter]);

  const totals = useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalCommission = filteredPayments.reduce((sum, p) => sum + p.commission, 0);
    const totalGateway = filteredPayments.reduce((sum, p) => sum + (p.gatewayFee || 0), 0);
    const totalNet = filteredPayments.reduce((sum, p) => sum + p.netAmount, 0);
    return { totalAmount, totalCommission, totalGateway, totalNet };
  }, [filteredPayments]);

  // ── Centros Estéticos: mismo patrón que médicos (líneas de arriba), clonado ──
  const paymentsByAesthetic = useMemo(() => {
    const grouped = new Map<string, AdminAestheticPayment[]>();
    aestheticPayments.forEach((payment) => {
      const providerName = payment.providerName;
      if (!grouped.has(providerName)) {
        grouped.set(providerName, []);
      }
      grouped.get(providerName)!.push(payment);
    });
    return grouped;
  }, [aestheticPayments]);

  const aestheticTotals = useMemo(() => {
    const totals = new Map<string, { totalAmount: number; totalCommission: number; totalNet: number; count: number; pendingCount: number }>();
    aestheticPayments.forEach((payment) => {
      const providerName = payment.providerName;
      if (!totals.has(providerName)) {
        totals.set(providerName, { totalAmount: 0, totalCommission: 0, totalNet: 0, count: 0, pendingCount: 0 });
      }
      const providerTotal = totals.get(providerName)!;
      providerTotal.totalAmount += payment.amount;
      providerTotal.totalCommission += payment.commission;
      providerTotal.totalNet += payment.netAmount;
      providerTotal.count += 1;
      if (payment.status === "pending") {
        providerTotal.pendingCount += 1;
      }
    });
    return totals;
  }, [aestheticPayments]);

  const handleMarkAestheticAsPaid = (providerName: string) => {
    setAestheticToPay(providerName);
    setIsAestheticPaymentConfirmDialogOpen(true);
  };

  const confirmAestheticPayment = async () => {
    if (!aestheticToPay) return;

    try {
      const providerPayments = aestheticPayments.filter(
        (p) => p.providerName === aestheticToPay && p.status === "pending"
      );
      const paymentIds = providerPayments.map((p) => p.id);

      const providerId = providerPayments[0]?.providerId;
      if (!providerId) return;

      await markAestheticPaymentsAsPaidAPI(providerId, paymentIds);

      setAestheticPayments((prevPayments) =>
        prevPayments.map((payment) => {
          if (payment.providerName === aestheticToPay && payment.status === "pending") {
            return { ...payment, status: "paid" as const };
          }
          return payment;
        })
      );

      setIsAestheticPaymentConfirmDialogOpen(false);
      setAestheticToPay(null);
    } catch (err: any) {
      feedback.showFeedback('error', 'Error', getUserFriendlyMessage(err, { fallback: 'No fue posible marcar los pagos como pagados.' }));
    }
  };

  const getAestheticPendingTotal = (providerName: string) => {
    const providerPayments = aestheticPayments.filter(
      (p) => p.providerName === providerName && p.status === "pending"
    );
    return providerPayments.reduce((sum, p) => sum + p.netAmount, 0);
  };

  const selectedAestheticPayments = useMemo(() => {
    if (!selectedAesthetic) return [];
    return paymentsByAesthetic.get(selectedAesthetic) || [];
  }, [selectedAesthetic, paymentsByAesthetic]);

  const getAestheticBankAccount = (providerName: string) => {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("aesthetic-profile-")) {
        try {
          const profile = JSON.parse(localStorage.getItem(key) || "{}");
          if (profile?.provider?.name === providerName && profile?.provider?.bankAccount) {
            return profile.provider.bankAccount;
          }
        } catch (error) {
          console.error("Error reading aesthetic provider profile:", error);
        }
      }
    }
    return {
      bankName: "Banco Pichincha",
      accountNumber: "2100123456789",
      accountType: "checking",
      accountHolder: providerName,
    };
  };

  const selectedAestheticBankAccount = useMemo(() => {
    if (!selectedAesthetic) return null;
    const paymentWithBank = aestheticPayments.find(
      (p) => p.providerName === selectedAesthetic && p.doctorBankAccount
    );
    if (paymentWithBank?.doctorBankAccount) {
      return paymentWithBank.doctorBankAccount;
    }
    return getAestheticBankAccount(selectedAesthetic);
  }, [selectedAesthetic, aestheticPayments]);

  const filteredAesthetic = useMemo(() => {
    let filtered = aestheticPayments;

    if (aestheticStatusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === aestheticStatusFilter);
    }

    if (aestheticFilter !== "all" && aestheticFilter.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.providerName.toLowerCase().includes(aestheticFilter.toLowerCase()) ||
        p.patientName.toLowerCase().includes(aestheticFilter.toLowerCase())
      );
    }

    return filtered;
  }, [aestheticPayments, aestheticStatusFilter, aestheticFilter]);

  const aestheticSummaryTotals = useMemo(() => {
    const totalAmount = filteredAesthetic.reduce((sum, p) => sum + p.amount, 0);
    const totalCommission = filteredAesthetic.reduce((sum, p) => sum + p.commission, 0);
    const totalGateway = filteredAesthetic.reduce((sum, p) => sum + (p.gatewayFee || 0), 0);
    const totalNet = filteredAesthetic.reduce((sum, p) => sum + p.netAmount, 0);
    return { totalAmount, totalCommission, totalGateway, totalNet };
  }, [filteredAesthetic]);

  const filteredClinicPayments = useMemo(() => {
    let filtered = clinicPayments;

    if (clinicStatusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === clinicStatusFilter);
    }

    if (clinicSearchFilter !== "all" && clinicSearchFilter.trim() !== "") {
      filtered = filtered.filter((p) => 
        p.clinicName.toLowerCase().includes(clinicSearchFilter.toLowerCase())
      );
    }

    return filtered;
  }, [clinicPayments, clinicStatusFilter, clinicSearchFilter]);

  // Agrupar payouts por clínica
  interface ClinicGroupRow {
    id: string;
    clinicId: string;
    clinicName: string;
    count: number;
    totalAmount: number;
    appCommission: number;
    gatewayFee: number;
    netAmount: number;
    status: "pending" | "paid";
    paymentDate: string | null;
    createdAt: string;
    appointments: any[];
    isDistributed: boolean;
    distributedAmount: number;
    remainingAmount: number;
    clinicBankAccount?: any;
    payouts: AdminClinicPayment[];
  }

  const clinicGroupRows = useMemo<ClinicGroupRow[]>(() => {
    const grouped = new Map<string, AdminClinicPayment[]>();
    filteredClinicPayments.forEach((payment) => {
      const key = payment.clinicId || "unknown";
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(payment);
    });

    return Array.from(grouped.entries()).map(([clinicId, list]) => {
      const totalAmount = list.reduce((sum, p) => sum + p.totalAmount, 0);
      const appCommission = list.reduce((sum, p) => sum + p.appCommission, 0);
      const gatewayFee = list.reduce((sum, p) => sum + (p.gatewayFee || 0), 0);
      const netAmount = list.reduce((sum, p) => sum + p.netAmount, 0);
      const remainingAmount = list.reduce((sum, p) => sum + p.remainingAmount, 0);
      const distributedAmount = list.reduce((sum, p) => sum + p.distributedAmount, 0);
      
      const appointments = list.reduce<any[]>((all, p) => {
        const mappedApts = p.appointments.map(apt => ({
          ...apt,
          gatewayFee: apt.gatewayFee || Number((apt.amount * 0.06345 + 0.046).toFixed(2)),
        }));
        return [...all, ...mappedApts];
      }, []);

      const pendingPayouts = list.filter((p) => p.status === "pending");
      const status = pendingPayouts.length > 0 ? "pending" as const : "paid" as const;
      const clinicBankAccount = list.find((p) => p.clinicBankAccount)?.clinicBankAccount;

      return {
        id: clinicId,
        clinicId,
        clinicName: list[0]?.clinicName || "Clínica",
        count: list.length,
        totalAmount,
        appCommission,
        gatewayFee,
        netAmount,
        status,
        paymentDate: list.find(p => p.paymentDate)?.paymentDate || null,
        createdAt: list[0]?.createdAt || new Date().toISOString(),
        appointments,
        isDistributed: list.some(p => p.isDistributed),
        distributedAmount,
        remainingAmount,
        clinicBankAccount,
        payouts: list,
      };
    });
  }, [filteredClinicPayments]);

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
    let allDoctors = Array.from(new Set(payments.map((p) => p.providerName)));
    if (doctorFilter !== "all" && doctorFilter.trim() !== "") {
      allDoctors = allDoctors.filter((name) =>
        name.toLowerCase().includes(doctorFilter.toLowerCase())
      );
    }
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
  }, [payments, doctorTotals, doctorFilter]);

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
        <Stack spacing={0.5} justifyContent="center" sx={{ height: "100%" }}>
          <Typography fontWeight={600} color="#10b981" sx={{ lineHeight: 1.2 }}>
            {formatMoney(params.row.totalNet)}
          </Typography>
          {params.row.pendingCount > 0 && (
            <Typography variant="caption" color="warning.main" fontWeight={600} sx={{ lineHeight: 1 }}>
              {formatMoney(params.row.pendingTotal)} pendiente
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 110,
      renderCell: (params: { row: DoctorGroupRow }) => (
        <Chip
          label={params.row.pendingCount > 0 ? "Pendiente" : "Pagado"}
          color={params.row.pendingCount > 0 ? "warning" : "success"}
          size="small"
        />
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

  // ── Columnas: Centros Estéticos agrupados (clon de Médicos agrupados) ──────
  interface AestheticGroupRow {
    id: string;
    providerName: string;
    count: number;
    totalAmount: number;
    totalCommission: number;
    totalNet: number;
    pendingCount: number;
    pendingTotal: number;
  }

  const aestheticGroupRows: AestheticGroupRow[] = useMemo(() => {
    let allProviders = Array.from(new Set(aestheticPayments.map((p) => p.providerName)));
    if (aestheticFilter !== "all" && aestheticFilter.trim() !== "") {
      allProviders = allProviders.filter((name) =>
        name.toLowerCase().includes(aestheticFilter.toLowerCase())
      );
    }
    return allProviders.map((providerName) => {
      const t = aestheticTotals.get(providerName) || { totalAmount: 0, totalCommission: 0, totalNet: 0, count: 0, pendingCount: 0 };
      return {
        id: providerName,
        providerName,
        count: t.count,
        totalAmount: t.totalAmount,
        totalCommission: t.totalCommission,
        totalNet: t.totalNet,
        pendingCount: t.pendingCount,
        pendingTotal: getAestheticPendingTotal(providerName),
      };
    });
  }, [aestheticPayments, aestheticTotals, aestheticFilter]);

  const aestheticGroupColumns = useMemo(() => [
    {
      field: "providerName",
      headerName: "Centro Estético",
      flex: 1,
      minWidth: 200,
      renderCell: (params: { row: AestheticGroupRow }) => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.light", width: 36, height: 36 }}>
            {params.row.providerName.charAt(0)}
          </Avatar>
          <Typography fontWeight={600}>{params.row.providerName}</Typography>
        </Stack>
      ),
    },
    {
      field: "count",
      headerName: "Pagos",
      width: 100,
      renderCell: (params: { row: AestheticGroupRow }) => (
        <Chip label={params.row.count} color="primary" size="small" />
      ),
    },
    {
      field: "totalAmount",
      headerName: "Total Cobrado",
      width: 140,
      renderCell: (params: { row: AestheticGroupRow }) => (
        <Typography fontWeight={600}>{formatMoney(params.row.totalAmount)}</Typography>
      ),
    },
    {
      field: "totalCommission",
      headerName: "Comisión",
      width: 120,
      renderCell: (params: { row: AestheticGroupRow }) => (
        <Typography color="text.secondary">{formatMoney(params.row.totalCommission)}</Typography>
      ),
    },
    {
      field: "totalNet",
      headerName: "Total Neto",
      width: 140,
      renderCell: (params: { row: AestheticGroupRow }) => (
        <Stack spacing={0.5} justifyContent="center" sx={{ height: "100%" }}>
          <Typography fontWeight={600} color="#10b981" sx={{ lineHeight: 1.2 }}>
            {formatMoney(params.row.totalNet)}
          </Typography>
          {params.row.pendingCount > 0 && (
            <Typography variant="caption" color="warning.main" fontWeight={600} sx={{ lineHeight: 1 }}>
              {formatMoney(params.row.pendingTotal)} pendiente
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 110,
      renderCell: (params: { row: AestheticGroupRow }) => (
        <Chip
          label={params.row.pendingCount > 0 ? "Pendiente" : "Pagado"}
          color={params.row.pendingCount > 0 ? "warning" : "success"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 240,
      renderCell: (params: { row: AestheticGroupRow }) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined" size="small" startIcon={<Visibility />}
            onClick={() => { setSelectedAesthetic(params.row.providerName); setIsAestheticDetailModalOpen(true); }}
            sx={{ textTransform: "none" }}
          >
            Ver Detalle
          </Button>
          {params.row.pendingCount > 0 && (
            <Button
              variant="contained" size="small" color="success" startIcon={<PaymentIcon />}
              onClick={() => handleMarkAestheticAsPaid(params.row.providerName)}
              sx={{ textTransform: "none" }}
            >
              Pagar
            </Button>
          )}
        </Stack>
      ),
    },
  ], []);

  // ── Columnas: Detalle de Pagos a Centros Estéticos ─────────────────────────
  const aestheticDetailColumns = useMemo(() => [
    {
      field: "providerName",
      headerName: "Centro Estético",
      flex: 1,
      minWidth: 180,
      renderCell: (params: { row: AdminAestheticPayment }) => (
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
      renderCell: (params: { row: AdminAestheticPayment }) => (
        <Typography>{new Date(params.row.date).toLocaleDateString("es-ES")}</Typography>
      ),
    },
    {
      field: "amount",
      headerName: "Monto Cobrado",
      width: 130,
      renderCell: (params: { row: AdminAestheticPayment }) => (
        <Typography fontWeight={600}>{formatMoney(params.row.amount)}</Typography>
      ),
    },
    {
      field: "commission",
      headerName: "Comisión",
      width: 130,
      renderCell: (params: { row: AdminAestheticPayment }) => (
        <Typography color="text.secondary">{formatMoney(params.row.commission)}</Typography>
      ),
    },
    {
      field: "netAmount",
      headerName: "Total Neto",
      width: 130,
      renderCell: (params: { row: AdminAestheticPayment }) => (
        <Typography fontWeight={600} color="#10b981">{formatMoney(params.row.netAmount)}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 110,
      renderCell: (params: { row: AdminAestheticPayment }) => (
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
      field: "gatewayFee",
      headerName: "Comisión Nuvei",
      width: 130,
      renderCell: (params: { row: AdminClinicPayment }) => (
        <Typography color="text.secondary">{formatMoney(params.row.gatewayFee || 0)}</Typography>
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

  // ── Columnas: Auditoría de Transacciones ──────────────────────────────────
  const transactionColumns = useMemo(() => [
    {
      field: "externalTransactionId",
      headerName: "ID Transacción (Nuvei / UUID)",
      flex: 1.2,
      minWidth: 200,
      renderCell: (params: { row: AdminTransaction }) => (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <Typography fontWeight={700} color="primary.main" variant="body2">{params.row.externalTransactionId}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", mt: 0.5 }}>{params.row.id}</Typography>
        </Box>
      ),
    },
    {
      field: "amount",
      headerName: "Valor Pagado",
      width: 120,
      renderCell: (params: { row: AdminTransaction }) => (
        <Typography fontWeight={600} color="#10b981">{formatMoney(params.row.amount)}</Typography>
      ),
    },
    {
      field: "patient",
      headerName: "Paciente",
      flex: 1,
      minWidth: 180,
      renderCell: (params: { row: AdminTransaction }) => (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <Typography fontWeight={600} variant="body2">{params.row.patient.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>CI: {params.row.patient.identification}</Typography>
        </Box>
      ),
    },
    {
      field: "doctor",
      headerName: "Médico / Especialidad",
      flex: 1,
      minWidth: 180,
      renderCell: (params: { row: AdminTransaction }) => (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <Typography fontWeight={600} variant="body2">{params.row.doctor.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>{params.row.doctor.specialty}</Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Fecha Pago",
      width: 150,
      renderCell: (params: { row: AdminTransaction }) => (
        <Typography variant="body2">{new Date(params.row.createdAt).toLocaleString('es-ES')}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "Estado",
      width: 120,
      renderCell: (params: { row: AdminTransaction }) => {
        const props = getStatusChipProps(params.row.status);
        return (
          <Chip
            label={props.label}
            color={props.color}
            size="small"
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 130,
      renderCell: (params: { row: AdminTransaction }) => (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Visibility />}
          onClick={() => { setSelectedTransaction(params.row); setIsTransactionModalOpen(true); }}
          sx={{ textTransform: "none" }}
        >
          Ver Detalle
        </Button>
      ),
    },
  ], []);



  const handleApproveRefund = useCallback(async (paymentId: string) => {
    try {
      feedback.showFeedback('info', 'Procesando...', 'Enviando solicitud de reembolso a Nuvei...');
      await approveAdminRefundAPI(paymentId);
      feedback.showFeedback('success', 'Éxito', 'El reembolso fue procesado y devuelto a la tarjeta real del paciente.');
      setRefundsRefreshKey(prev => prev + 1);
    } catch (err: any) {
      feedback.showFeedback('error', 'Error al reembolsar', getUserFriendlyMessage(err, { fallback: 'No se pudo procesar el reembolso en la pasarela.' }));
    }
  }, [feedback]);

  const handleRejectRefund = useCallback(async (paymentId: string) => {
    try {
      await rejectAdminRefundAPI(paymentId);
      feedback.showFeedback('success', 'Éxito', 'La solicitud de reembolso fue rechazada.');
      setRefundsRefreshKey(prev => prev + 1);
    } catch (err: any) {
      feedback.showFeedback('error', 'Error', 'No se pudo rechazar la solicitud.');
    }
  }, [feedback]);

  const refundColumns = useMemo(() => [
    {
      field: "patient",
      headerName: "Paciente",
      flex: 1,
      minWidth: 180,
      renderCell: (params: { row: AdminRefundRequest }) => (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <Typography fontWeight={600} variant="body2">{params.row.patient.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>CI: {params.row.patient.identification}</Typography>
        </Box>
      ),
    },
    {
      field: "doctor",
      headerName: "Médico / Especialidad",
      flex: 1,
      minWidth: 180,
      renderCell: (params: { row: AdminRefundRequest }) => (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <Typography fontWeight={600} variant="body2">{params.row.doctor.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>{params.row.doctor.specialty}</Typography>
        </Box>
      ),
    },
    {
      field: "amount",
      headerName: "Monto",
      width: 110,
      renderCell: (params: { row: AdminRefundRequest }) => (
        <Typography fontWeight={600} color="#e11d48">{formatMoney(params.row.amount)}</Typography>
      ),
    },
    {
      field: "reason",
      headerName: "Motivo del Reembolso",
      flex: 1.5,
      minWidth: 250,
      renderCell: (params: { row: AdminRefundRequest }) => (
        <Typography variant="body2" sx={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {params.row.reason}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Fecha Solicitud",
      width: 150,
      renderCell: (params: { row: AdminRefundRequest }) => (
        <Typography variant="body2">{new Date(params.row.createdAt).toLocaleString('es-ES')}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 280,
      renderCell: (params: { row: AdminRefundRequest }) => (
        <Stack direction="row" spacing={1} sx={{ height: "100%", alignItems: "center" }}>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleApproveRefund(params.row.id)}
            sx={{ textTransform: "none" }}
          >
            Aprobar Reembolso
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleRejectRefund(params.row.id)}
            sx={{ textTransform: "none" }}
          >
            Rechazar
          </Button>
        </Stack>
      ),
    },
  ], [handleApproveRefund, handleRejectRefund]);

  const handleRefresh = useCallback(() => {
    if (currentTab === 0 || currentTab === 1) {
      const loadPayments = async () => {
        setLoading(true);
        try {
          const [doctorPaymentsData, aestheticPaymentsData, clinicPaymentsData] = await Promise.all([
            getAdminDoctorPaymentsAPI({ page: 1, limit: 1000 }),
            getAdminAestheticPaymentsAPI({ page: 1, limit: 1000 }),
            getAdminClinicPaymentsAPI({ page: 1, limit: 1000 })
          ]);
          setPayments(doctorPaymentsData.data);
          setAestheticPayments(aestheticPaymentsData.data);
          setClinicPayments(clinicPaymentsData.data);
        } catch (err: any) {
          setError(getUserFriendlyMessage(err, { fallback: 'No fue posible cargar los pagos.' }));
        } finally {
          setLoading(false);
        }
      };
      loadPayments();
    } else if (currentTab === 2) {
      setRefundsRefreshKey(prev => prev + 1);
    } else if (currentTab === 3) {
      setTransactionsRefreshKey(prev => prev + 1);
    }
  }, [currentTab]);



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
              Administra los pagos a médicos independientes y centros estéticos
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
              icon={<Spa />}
              iconPosition="start"
              label="Pagos a Centros Estéticos"
            />
            <Tab
              icon={<Undo />}
              iconPosition="start"
              label="Solicitudes de Reembolso"
            />
            <Tab
              icon={<History />}
              iconPosition="start"
              label="Auditoría de Transacciones"
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
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
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
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#fef3c7", border: "1px solid #fde68a" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CreditCard sx={{ color: "#f59e0b", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Comisión App
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#f59e0b">
                          {formatMoney(totals.totalCommission)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PaymentIcon sx={{ color: "#3b82f6", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Comisiones Nuvei
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#3b82f6">
                          {formatMoney(totals.totalGateway)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#fff7ed", border: "1px solid #fed7aa" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CreditCard sx={{ color: "#ea580c", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pendientes
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#ea580c">
                          {formatMoney(filteredPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netAmount, 0))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: "#10b981", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pagados
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#10b981">
                          {formatMoney(filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netAmount, 0))}
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

        {/* Tab Content - Pagos a Centros Estéticos (clon de "Pagos a Médicos", ocupa el lugar de "Pagos a Clínicas") */}
        {currentTab === 1 && (
          <Box>
            {/* Resumen de totales */}
            <Grid2 container spacing={3} mb={4}>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <AttachMoney sx={{ color: "#14b8a6", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Cobrado
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#14b8a6">
                          {formatMoney(aestheticSummaryTotals.totalAmount)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#fef3c7", border: "1px solid #fde68a" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CreditCard sx={{ color: "#f59e0b", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Comisión App
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#f59e0b">
                          {formatMoney(aestheticSummaryTotals.totalCommission)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PaymentIcon sx={{ color: "#3b82f6", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Comisiones Nuvei
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#3b82f6">
                          {formatMoney(aestheticSummaryTotals.totalGateway)}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#fff7ed", border: "1px solid #fed7aa" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CreditCard sx={{ color: "#ea580c", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pendientes
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#ea580c">
                          {formatMoney(filteredAesthetic.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netAmount, 0))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: "#10b981", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pagados
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#10b981">
                          {formatMoney(filteredAesthetic.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netAmount, 0))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>

            {/* Toolbar + DataTable: Centros Estéticos con Pagos con Tarjeta */}
            <TableToolbar
              title="Centros Estéticos con Pagos con Tarjeta"
              searchValue={aestheticFilter === "all" ? "" : aestheticFilter}
              searchPlaceholder="Filtrar por centro estético..."
              onSearchChange={(v) => { setAestheticFilter(v || "all"); setAestheticGroupPagination((p) => ({ ...p, page: 0 })); }}
              filters={[
                {
                  key: "status",
                  label: "Estado",
                  value: aestheticStatusFilter,
                  onChange: (v) => { setAestheticStatusFilter(v as any); setAestheticGroupPagination((p) => ({ ...p, page: 0 })); },
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
                  const all = Array.from(aestheticGroupRows);
                  const start = aestheticGroupPagination.page * aestheticGroupPagination.pageSize;
                  return all.slice(start, start + aestheticGroupPagination.pageSize);
                })()}
                columns={aestheticGroupColumns}
                getRowId={(row) => row.id}
                rowCount={aestheticGroupRows.length}
                paginationModel={aestheticGroupPagination}
                onPaginationModelChange={setAestheticGroupPagination}
                pageSizeOptions={[5, 10, 20]}
                rowHeight={64}
                emptyTitle="Sin centros estéticos con pagos"
                emptyDescription="No hay centros estéticos con pagos registrados."
              />
            </Box>

            {/* Toolbar + DataTable: Detalle de Pagos */}
            <TableToolbar
              title="Detalle de Pagos"
              searchValue={aestheticFilter === "all" ? "" : aestheticFilter}
              searchPlaceholder="Filtrar por centro estético..."
              onSearchChange={(v) => { setAestheticFilter(v || "all"); setAestheticDetailPagination((p) => ({ ...p, page: 0 })); }}
              sx={{ mb: 2 }}
            />
            <Box mb={4}>
              <DataTable
                rows={(() => {
                  const start = aestheticDetailPagination.page * aestheticDetailPagination.pageSize;
                  return filteredAesthetic.slice(start, start + aestheticDetailPagination.pageSize);
                })()}
                columns={aestheticDetailColumns}
                getRowId={(row) => row.id}
                rowCount={filteredAesthetic.length}
                paginationModel={aestheticDetailPagination}
                onPaginationModelChange={setAestheticDetailPagination}
                pageSizeOptions={[5, 10, 20]}
                rowHeight={64}
                emptyTitle="Sin pagos registrados"
                emptyDescription="No hay pagos que coincidan con los filtros aplicados."
              />
            </Box>

            {/* Modal de Detalle del Centro Estético */}
            <Dialog
              open={isAestheticDetailModalOpen}
              onClose={() => {
                setIsAestheticDetailModalOpen(false);
                setSelectedAesthetic(null);
              }}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Detalle de Pagos - {selectedAesthetic}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pagos con tarjeta y comisiones
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => {
                      setIsAestheticDetailModalOpen(false);
                      setSelectedAesthetic(null);
                    }}
                  >
                    <Close />
                  </IconButton>
                </Stack>
              </DialogTitle>
              <DialogContent>
                {selectedAesthetic && (
                  <Box>
                    <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
                      <Grid2 container spacing={3}>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Total Cobrado</Typography>
                            <Typography variant="h6" fontWeight={700} color="#14b8a6">
                              {formatMoney(aestheticTotals.get(selectedAesthetic)?.totalAmount || 0)}
                            </Typography>
                          </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Total Comisión</Typography>
                            <Typography variant="h6" fontWeight={700} color="#f59e0b">
                              {formatMoney(aestheticTotals.get(selectedAesthetic)?.totalCommission || 0)}
                            </Typography>
                          </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Total Neto del Centro Estético</Typography>
                            <Typography variant="h6" fontWeight={700} color="#10b981">
                              {formatMoney(aestheticTotals.get(selectedAesthetic)?.totalNet || 0)}
                            </Typography>
                          </Box>
                        </Grid2>
                      </Grid2>
                    </Paper>

                    {selectedAestheticBankAccount && (
                      <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: "#fff7ed", border: "2px solid #fbbf24", borderRadius: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                          <AccountBalance sx={{ color: "#f59e0b", fontSize: 24 }} />
                          <Typography variant="h6" fontWeight={700} color="#f59e0b">Datos Bancarios para Transferencia</Typography>
                        </Stack>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Utiliza esta información para realizar la transferencia externa al centro estético.
                        </Alert>
                        <Grid2 container spacing={2}>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Banco</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedAestheticBankAccount.bankName}</Typography>
                            </Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Número de Cuenta</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937" sx={{ fontFamily: "monospace" }}>{selectedAestheticBankAccount.accountNumber}</Typography>
                            </Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Tipo de Cuenta</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937">
                                {selectedAestheticBankAccount.accountType === "checking" || selectedAestheticBankAccount.accountType === "Corriente" ? "Corriente" : "Ahorros"}
                              </Typography>
                            </Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6 }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" fontWeight={600}>Titular de la Cuenta</Typography>
                              <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedAestheticBankAccount.accountHolder}</Typography>
                            </Box>
                          </Grid2>
                          {selectedAestheticBankAccount.identificationNumber && (
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>RUC / Cédula</Typography>
                                <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedAestheticBankAccount.identificationNumber}</Typography>
                              </Box>
                            </Grid2>
                          )}
                          {selectedAestheticBankAccount.email && (
                            <Grid2 size={{ xs: 12, sm: 6 }}>
                              <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Correo Electrónico</Typography>
                                <Typography variant="body1" fontWeight={700} color="#1f2937">{selectedAestheticBankAccount.email}</Typography>
                              </Box>
                            </Grid2>
                          )}
                        </Grid2>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ bgcolor: "#fef3c7", p: 2, borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight={600} color="#92400e" gutterBottom>Monto a Transferir:</Typography>
                          <Typography variant="h5" fontWeight={700} color="#f59e0b">{formatMoney(getAestheticPendingTotal(selectedAesthetic))}</Typography>
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
                          {selectedAestheticPayments.map((payment) => (
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
              open={isAestheticPaymentConfirmDialogOpen}
              onClose={() => { setIsAestheticPaymentConfirmDialogOpen(false); setAestheticToPay(null); }}
              maxWidth="sm" fullWidth
            >
              <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={700}>Confirmar Pago al Centro Estético</Typography>
                  <IconButton onClick={() => { setIsAestheticPaymentConfirmDialogOpen(false); setAestheticToPay(null); }}><Close /></IconButton>
                </Stack>
              </DialogTitle>
              <DialogContent>
                {aestheticToPay && (() => {
                  const paymentWithBank = aestheticPayments.find(
                    (p) => p.providerName === aestheticToPay && p.doctorBankAccount
                  );
                  const bankAccount = paymentWithBank?.doctorBankAccount || getAestheticBankAccount(aestheticToPay);
                  return (
                    <Stack spacing={3}>
                      <Alert severity="info">¿Estás seguro de que deseas marcar todos los pagos pendientes de <strong>{aestheticToPay}</strong> como pagados?</Alert>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Resumen del pago:</Typography>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: "#f9fafb", border: "1px solid #e5e7eb" }}>
                          <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Total a pagar:</Typography>
                              <Typography variant="body2" fontWeight={700} color="#10b981">{formatMoney(getAestheticPendingTotal(aestheticToPay))}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="body2">Pagos pendientes:</Typography>
                              <Typography variant="body2" fontWeight={600}>{aestheticTotals.get(aestheticToPay)?.pendingCount || 0} citas</Typography>
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
                <Button onClick={() => { setIsAestheticPaymentConfirmDialogOpen(false); setAestheticToPay(null); }} sx={{ textTransform: "none" }}>Cancelar</Button>
                <Button onClick={confirmAestheticPayment} variant="contained" color="success" startIcon={<CheckCircle />} sx={{ textTransform: "none" }}>Confirmar Pago Realizado</Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {/* Tab Content - Pagos a Clínicas (OCULTO: módulo de clínicas fuera de uso, código conservado sin borrar) */}
        {false && (
          <Box>
            {/* Resumen de totales de clínicas */}
            <Grid2 container spacing={3} mb={4}>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#f0fdfa", border: "1px solid #d1fae5" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <AttachMoney sx={{ color: "#14b8a6", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Total Cobrado
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#14b8a6">
                          {formatMoney(filteredClinicPayments.reduce((sum, p) => sum + p.totalAmount, 0))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#fef3c7", border: "1px solid #fde68a" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CreditCard sx={{ color: "#f59e0b", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Comisión App
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#f59e0b">
                          {formatMoney(filteredClinicPayments.reduce((sum, p) => sum + p.appCommission, 0))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PaymentIcon sx={{ color: "#3b82f6", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Comisiones Nuvei
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#3b82f6">
                          {formatMoney(filteredClinicPayments.reduce((sum, p) => sum + (p.gatewayFee || 0), 0))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#fff7ed", border: "1px solid #ffedd5" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CreditCard sx={{ color: "#f97316", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pendientes
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#f97316">
                          {formatMoney(filteredClinicPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.netAmount, 0))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ bgcolor: "#ecfdf5", border: "1px solid #a7f3d0" }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <CheckCircle sx={{ color: "#10b981", fontSize: 32 }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Pagados
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="#10b981">
                          {formatMoney(filteredClinicPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netAmount, 0))}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>

            {/* Toolbar + DataTable: Clínicas */}
            <TableToolbar
              title="Clínicas y Liquidaciones"
              searchValue={clinicSearchFilter === "all" ? "" : clinicSearchFilter}
              searchPlaceholder="Filtrar por clínica..."
              onSearchChange={(v) => { setClinicSearchFilter(v || "all"); setClinicPagination((p) => ({ ...p, page: 0 })); }}
              filters={[
                {
                  key: "status",
                  label: "Estado",
                  value: clinicStatusFilter,
                  onChange: (v) => { setClinicStatusFilter(v as any); setClinicPagination((p) => ({ ...p, page: 0 })); },
                  options: [
                    { value: "all", label: "Todas" },
                    { value: "pending", label: "Pendientes" },
                    { value: "paid", label: "Pagadas" },
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
                   const start = clinicPagination.page * clinicPagination.pageSize;
                   return clinicGroupRows.slice(start, start + clinicPagination.pageSize);
                 })()}
                 columns={clinicColumns}
                 getRowId={(row) => row.id}
                 rowCount={clinicGroupRows.length}
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
                        <Grid2 size={{ xs: 12, sm: 3 }}>
                          <Typography variant="caption" color="text.secondary">
                            Total Cobrado
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="#14b8a6">
                            {formatMoney(selectedClinic.totalAmount)}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 3 }}>
                          <Typography variant="caption" color="text.secondary">
                            Comisión App
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="#f59e0b">
                            {formatMoney(selectedClinic.appCommission)}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 3 }}>
                          <Typography variant="caption" color="text.secondary">
                            Comisión Nuvei
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="#3b82f6">
                            {formatMoney(selectedClinic.gatewayFee || 0)}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 3 }}>
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
                              Comisión Nuvei
                            </TableCell>
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
                                <Typography color="text.secondary">
                                  {formatMoney(apt.gatewayFee || 0)}
                                </Typography>
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
                      const pendingPayouts = clinicToPay.payouts.filter((p) => p.status === "pending");
                      const pendingIds = pendingPayouts.map((p) => p.id);
                      
                      // Marcar todos los payouts pendientes como pagados en paralelo
                      await Promise.all(pendingIds.map(id => markClinicPaymentAsPaidAPI(id)));
                      
                      // Actualizar estado local
                      setClinicPayments((prev) =>
                        prev.map((p) =>
                          pendingIds.includes(p.id)
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

        {/* Tab Content - Solicitudes de Reembolso */}
        {currentTab === 2 && (
          <Box>
            <TableToolbar
              title="Solicitudes de Reembolso de Pacientes (Nuvei)"
              actions={[
                { label: "Refrescar", icon: <Refresh />, onClick: () => { setRefundsRefreshKey((k) => k + 1); }, variant: "outlined" },
              ]}
              sx={{ mb: 2 }}
            />
            
            <Box mb={4}>
              <DataTable
                rows={refundRequests}
                columns={refundColumns}
                getRowId={(row) => row.id}
                loading={loadingRefunds}
                rowHeight={90}
                emptyTitle="Sin solicitudes de reembolso"
                emptyDescription="No hay solicitudes de reembolso pendientes de aprobación en el sistema."
              />
            </Box>
          </Box>
        )}

        {/* Tab Content - Auditoría de Transacciones */}
        {currentTab === 3 && (
          <Box>
            <TableToolbar
              title="Registro de Transacciones de Cobros (Nuvei)"
              searchValue={transactionsSearch}
              searchPlaceholder="Buscar por ID, CI, paciente o médico..."
              onSearchChange={(v) => { setTransactionsSearch(v || ""); setTransactionsPagination((p) => ({ ...p, page: 0 })); }}
              actions={[
                { label: "Refrescar", icon: <Refresh />, onClick: () => { setTransactionsSearch(""); setTransactionsPagination((p) => ({ ...p, page: 0 })); setTransactionsRefreshKey((k) => k + 1); }, variant: "outlined" },
              ]}
              sx={{ mb: 2 }}
            />
            
            <Box mb={4}>
              <DataTable
                rows={transactions}
                columns={transactionColumns}
                getRowId={(row) => row.id}
                rowCount={transactionsTotal}
                paginationModel={transactionsPagination}
                onPaginationModelChange={setTransactionsPagination}
                pageSizeOptions={[5, 10, 20]}
                rowHeight={80}
                loading={loadingTransactions}
                emptyTitle="Sin transacciones encontradas"
                emptyDescription="No hay registros de transacciones para la búsqueda actual."
              />
            </Box>

            {/* Modal de Detalle de Auditoría de Transacción */}
            <Dialog
              open={isTransactionModalOpen}
              onClose={() => {
                setIsTransactionModalOpen(false);
                setSelectedTransaction(null);
              }}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Detalle de Auditoría de Transacción
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Respaldo legal de transacción de Nuvei
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => {
                      setIsTransactionModalOpen(false);
                      setSelectedTransaction(null);
                    }}
                  >
                    <Close />
                  </IconButton>
                </Stack>
              </DialogTitle>
              <DialogContent>
                {selectedTransaction && (
                  <Stack spacing={3} mt={1}>
                    <Paper elevation={0} sx={{ p: 3, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>ID TRANSACCIÓN INTERNA (UUID)</Typography>
                          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>{selectedTransaction.id}</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>ID TRANSACCIÓN EXTERNA (NUVEI REFERENCE)</Typography>
                          <Typography variant="body1" fontWeight={700} color="primary.main">{selectedTransaction.externalTransactionId}</Typography>
                        </Grid2>
                        
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>ESTADO TRANSACCIÓN</Typography>
                          <Box mt={0.5}>
                            <Chip
                              label={getStatusChipProps(selectedTransaction.status).label}
                              color={getStatusChipProps(selectedTransaction.status).color}
                              size="small"
                            />
                          </Box>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>MONTO PAGADO</Typography>
                          <Typography variant="body1" fontWeight={700} color="#10b981">
                            {formatMoney(selectedTransaction.amount)}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 4 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>MÉTODO / ORIGEN DE PAGO</Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {selectedTransaction.paymentMethod} ({selectedTransaction.paymentSource})
                          </Typography>
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>FECHA Y HORA DE CREACIÓN (SOLICITUD)</Typography>
                          <Typography variant="body2">
                            {new Date(selectedTransaction.createdAt).toLocaleString('es-ES')}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>FECHA Y HORA DE PAGO (CONFIRMACIÓN)</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {selectedTransaction.paidAt ? new Date(selectedTransaction.paidAt).toLocaleString('es-ES') : "Pendiente de confirmación"}
                          </Typography>
                        </Grid2>
                      </Grid2>
                    </Paper>

                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">Datos del Paciente</Typography>
                    <Paper elevation={0} sx={{ p: 2, border: "1px solid #e2e8f0" }}>
                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="text.secondary">Nombre Completo</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedTransaction.patient.name}</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="text.secondary">Cédula de Identidad / RUC / Pasaporte</Typography>
                          <Typography variant="body2" fontWeight={700}>{selectedTransaction.patient.identification}</Typography>
                        </Grid2>
                      </Grid2>
                    </Paper>

                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">Datos de la Consulta Médica</Typography>
                    <Paper elevation={0} sx={{ p: 2, border: "1px solid #e2e8f0" }}>
                      <Grid2 container spacing={2}>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="text.secondary">Médico Especialista</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedTransaction.doctor.name}</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="text.secondary">Especialidad</Typography>
                          <Typography variant="body2" fontWeight={600}>{selectedTransaction.doctor.specialty}</Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="text.secondary">Fecha y Hora de la Cita</Typography>
                          <Typography variant="body2" fontWeight={700}>
                            {selectedTransaction.appointment.date ? new Date(selectedTransaction.appointment.date).toLocaleString('es-ES') : "N/A"}
                          </Typography>
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" color="text.secondary">Motivo de Consulta</Typography>
                          <Typography variant="body2">{selectedTransaction.appointment.reason || "No especificado"}</Typography>
                        </Grid2>
                      </Grid2>
                    </Paper>
                  </Stack>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 2, pr: 3 }}>
                <Button
                  onClick={() => {
                    setIsTransactionModalOpen(false);
                    setSelectedTransaction(null);
                  }}
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
        </>
        )}
      </Box>
    </DashboardLayout>
  );
};

