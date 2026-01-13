import { AttachMoney, CreditCard, CheckCircle, HourglassEmpty } from "@mui/icons-material";
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
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useMemo } from "react";
import { getPaymentsMock } from "../../infrastructure/payments.mock";
import type { Payment } from "../../domain/Payment.entity";
import { formatMoney } from "../../../../shared/lib/formatMoney";

export const PaymentsSection = () => {
  const [payments] = useState<Payment[]>(getPaymentsMock());
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all");

  const filteredPayments = useMemo(() => {
    if (statusFilter === "all") return payments;
    return payments.filter((p) => p.status === statusFilter);
  }, [payments, statusFilter]);

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

      {/* Filtro de estado */}
      <Box mb={3}>
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
    </div>
  );
};

