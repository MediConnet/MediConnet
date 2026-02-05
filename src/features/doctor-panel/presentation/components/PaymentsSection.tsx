import { AttachMoney, CreditCard, CheckCircle, HourglassEmpty, AccountBalance, Edit, Search, Info } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useMemo, useEffect } from "react";
import { getPaymentsMock } from "../../infrastructure/payments.mock";
import type { Payment } from "../../domain/Payment.entity";
import { formatMoney } from "../../../../shared/lib/formatMoney";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { useUpdateDoctorProfile } from "../hooks/useUpdateDoctorProfile";

import { handleLetterInput, handleNumberInput } from "../../../../shared/lib/inputValidation";

// Lista de bancos de Ecuador
const ECUADOR_BANKS = [
  "Banco Pichincha",
  "Banco de Guayaquil",
  "Banco del Pacífico",
  "Banco Internacional",
  "Banco Produbanco",
  "Banco Bolivariano",
  "Banco General Rumiñahui",
  "Banco de Loja",
  "Banco Solidario",
  "Banco del Austro",
  "Banco Comercial de Manabí",
  "Banco D-Miro",
  "Banco Finca",
  "Banco ProCredit",
  "Banco Coopnacional",
  "Banco Amazonas",
  "Banco Capital",
  "Banco Litoral",
  "Banco Machala",
  "Banco Unión",
];

export const PaymentsSection = () => {
  const { data, refetch } = useDoctorDashboard();
  const { updateProfile, loading: savingBank } = useUpdateDoctorProfile();
  // not using auth user here for bank updates
  const doctorName = data?.doctor?.name || "Dr. Juan Pérez";
  
  // Detectar si el médico es independiente o está asociado a una clínica
  const isClinicAssociated = (data as any)?.doctor?.clinicId ? true : false;
  const clinicName = (data as any)?.doctor?.clinicName || '';
  const paymentSource = isClinicAssociated ? 'clinic' : 'admin';
  
  // Obtener pagos del doctor actual (solo Dr. Juan Pérez)
  const [payments] = useState<Payment[]>(() => getPaymentsMock(doctorName));
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [bankDialogOpen, setBankDialogOpen] = useState(false);

  const [bankData, setBankData] = useState({
    bankName: "",
    accountNumber: "",
    accountType: "checking",
    accountHolder: "",
  });

  useEffect(() => {
    if ((data as any)?.doctor?.bankAccount) {
      setBankData((data as any).doctor.bankAccount);
    }
  }, [data]);

  const handleSaveBankData = async () => {
    await updateProfile({ bankAccount: bankData } as any);
    setBankDialogOpen(false);
    refetch();
  };

  const filteredPayments = useMemo(() => {
    let filtered = payments;

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Filtrar por búsqueda (nombre del paciente, fecha, o monto)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((p) => {
        const patientName = p.patientName.toLowerCase();
        const date = new Date(p.date).toLocaleDateString("es-ES").toLowerCase();
        const amount = p.amount.toString();
        const netAmount = p.netAmount.toString();
        
        return (
          patientName.includes(query) ||
          date.includes(query) ||
          amount.includes(query) ||
          netAmount.includes(query)
        );
      });
    }

    return filtered;
  }, [payments, statusFilter, searchQuery]);

  const totals = useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalCommission = filteredPayments.reduce((sum, p) => sum + p.commission, 0);
    const totalNet = filteredPayments.reduce((sum, p) => sum + p.netAmount, 0);
    return { totalAmount, totalCommission, totalNet };
  }, [filteredPayments]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Pagos e Ingresos</h3>
          <p className="text-sm text-gray-500 mt-1">
            Listado de citas pagadas con tarjeta, comisiones y total neto
          </p>
        </div>
      </div>

      {/* Banner Informativo según Fuente de Pago */}
      {paymentSource === 'admin' ? (
        <Alert 
          severity="info" 
          icon={<Info />}
          sx={{ mb: 3, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}
        >
          <Typography variant="body2" fontWeight={600}>
            Médico Independiente
          </Typography>
          <Typography variant="caption">
            Recibes pagos directamente del administrador de la plataforma
          </Typography>
        </Alert>
      ) : (
        <Alert 
          severity="info" 
          icon={<Info />}
          sx={{ mb: 3, bgcolor: '#fef3c7', border: '1px solid #fde68a' }}
        >
          <Typography variant="body2" fontWeight={600}>
            Médico Asociado a Clínica
          </Typography>
          <Typography variant="caption">
            Tus pagos son gestionados por <strong>{clinicName}</strong>. Los montos que ves aquí son asignados por la clínica.
          </Typography>
        </Alert>
      )}

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
                    Comisión App (15%)
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
                <CheckCircle sx={{ color: "#10b981", fontSize: 32 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Neto
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

      {/* Datos Bancarios */}
      <Card elevation={0} sx={{ border: "1px solid #e5e7eb", mb: 4 }}>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <AccountBalance sx={{ color: "#06b6d4", fontSize: 28 }} />
              <div>
                <Typography variant="h6" fontWeight={600}>
                  Datos Bancarios
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Información para recibir pagos
                </Typography>
              </div>
            </div>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setBankDialogOpen(true)}
                sx={{ textTransform: "none" }}
              >
                {(data as any)?.doctor?.bankAccount ? "Editar" : "Agregar"}
              </Button>
          </div>

          {(data as any)?.doctor?.bankAccount ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="caption" color="text.secondary">
                  Banco
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {(data as any).doctor.bankAccount.bankName}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Número de Cuenta
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {(data as any).doctor.bankAccount.accountNumber}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Tipo de Cuenta
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {(data as any).doctor.bankAccount.accountType === "checking" ? "Corriente" : "Ahorros"}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="text.secondary">
                  Titular
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {(data as any).doctor.bankAccount.accountHolder}
                </Typography>
              </div>
            </div>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              No hay datos bancarios registrados. Agrega tu información para recibir pagos.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Barra de búsqueda y filtros */}
      <Box mb={3}>
        <Stack spacing={2}>
          {/* Barra de búsqueda */}
          <TextField
            fullWidth
            placeholder="Buscar por paciente, fecha o monto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#f9fafb",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
                "&.Mui-focused": {
                  backgroundColor: "white",
                },
              },
            }}
          />
          
          {/* Filtro de estado */}
          <Stack direction="row" spacing={1}>
            <Chip
              label="Todos"
              onClick={() => setStatusFilter("all")}
              color={statusFilter === "all" ? "primary" : "default"}
              clickable
            />
            <Chip
              label="Pendientes"
              onClick={() => setStatusFilter("pending")}
              color={statusFilter === "pending" ? "primary" : "default"}
              clickable
            />
            <Chip
              label="Pagados"
              onClick={() => setStatusFilter("paid")}
              color={statusFilter === "paid" ? "primary" : "default"}
              clickable
            />
          </Stack>
        </Stack>
      </Box>

      {/* Tabla de pagos */}
      <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell sx={{ fontWeight: 600 }}>Paciente</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Monto Cobrado
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Comisión
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
                    <Typography fontWeight={600}>{payment.patientName}</Typography>
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
                      icon={payment.status === "paid" ? <CheckCircle /> : <HourglassEmpty />}
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

      {/* Dialog para editar datos bancarios */}
      <Dialog open={bankDialogOpen} onClose={() => setBankDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Datos Bancarios</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Banco</InputLabel>
              <Select
                value={bankData.bankName}
                onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                label="Banco"
              >
                {ECUADOR_BANKS.map((bank) => (
                  <MenuItem key={bank} value={bank}>
                    {bank}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Número de Cuenta"
              value={bankData.accountNumber}
              onChange={(e) => handleNumberInput(e, (value) => setBankData({ ...bankData, accountNumber: value }))}
              fullWidth
              required
              helperText="Solo números"
            />
            <FormControl fullWidth>
              <InputLabel>Tipo de Cuenta</InputLabel>
              <Select
                value={bankData.accountType}
                onChange={(e) => setBankData({ ...bankData, accountType: e.target.value })}
                label="Tipo de Cuenta"
              >
                <MenuItem value="checking">Corriente</MenuItem>
                <MenuItem value="savings">Ahorros</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Titular de la Cuenta"
              value={bankData.accountHolder}
              onChange={(e) => handleLetterInput(e, (value) => setBankData({ ...bankData, accountHolder: value }))}
              fullWidth
              required
              helperText="Solo letras y espacios"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBankDialogOpen(false)} sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveBankData}
            variant="contained"
            disabled={savingBank || !bankData.bankName || !bankData.accountNumber || !bankData.accountHolder}
            sx={{ textTransform: "none", backgroundColor: "#06b6d4", "&:hover": { backgroundColor: "#0891b2" } }}
          >
            {savingBank ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

