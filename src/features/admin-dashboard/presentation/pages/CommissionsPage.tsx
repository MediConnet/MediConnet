import { Percent, TrendingUp, AttachMoney } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState, useMemo } from "react";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { getPaymentsMock } from "../../../doctor-panel/infrastructure/payments.mock";
import { formatMoney } from "../../../../shared/lib/formatMoney";

const CURRENT_ADMIN = {
  name: "Admin General",
  roleLabel: "Super Admin",
  initials: "AG",
};

const COMMISSION_RATE = 0.15; // 15%

export const CommissionsPage = () => {
  const [payments] = useState(getPaymentsMock());

  // Calcular comisiones por mes
  const commissionsByMonth = useMemo(() => {
    const monthlyData = new Map<string, { amount: number; commission: number; count: number }>();

    payments.forEach((payment) => {
      const month = new Date(payment.date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      });

      if (!monthlyData.has(month)) {
        monthlyData.set(month, { amount: 0, commission: 0, count: 0 });
      }

      const data = monthlyData.get(month)!;
      data.amount += payment.amount;
      data.commission += payment.commission;
      data.count += 1;
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());
  }, [payments]);

  const totalCommission = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.commission, 0);
  }, [payments]);

  const totalAmount = useMemo(() => {
    return payments.reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  return (
    <DashboardLayout role="ADMIN" userProfile={CURRENT_ADMIN}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Percent sx={{ fontSize: 32, color: "primary.main" }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Comisiones
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detalle del porcentaje y histórico de comisiones
            </Typography>
          </Box>
        </Stack>

        {/* Información de la comisión */}
        <Grid2 container spacing={3} mb={4}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card elevation={0} sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Percent sx={{ color: "#3b82f6", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Porcentaje de Comisión
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#3b82f6">
                      {COMMISSION_RATE * 100}%
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card elevation={0} sx={{ bgcolor: "#f0fdfa", border: "1px solid #a7f3d0" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AttachMoney sx={{ color: "#10b981", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total de Comisiones
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#10b981">
                      {formatMoney(totalCommission)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
            <Card elevation={0} sx={{ bgcolor: "#fef3c7", border: "1px solid #fde68a" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TrendingUp sx={{ color: "#f59e0b", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Procesado
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#f59e0b">
                      {formatMoney(totalAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>

        {/* Histórico de comisiones */}
        <Paper elevation={0} sx={{ border: "1px solid #e5e7eb" }}>
          <Box p={3}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Histórico de Comisiones por Mes
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f9fafb" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Mes</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Total Procesado
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Comisión ({COMMISSION_RATE * 100}%)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">
                      Transacciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commissionsByMonth.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No hay datos de comisiones
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    commissionsByMonth.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography fontWeight={600} sx={{ textTransform: "capitalize" }}>
                            {item.month}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600}>
                            {formatMoney(item.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight={600} color="#10b981">
                            {formatMoney(item.commission)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={item.count} color="primary" size="small" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

