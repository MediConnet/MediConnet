import { useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import {
  CalendarToday,
  AttachMoney,
  TrendingUp,
  People,
} from "@mui/icons-material";
import { generateMockAppointments } from "../../infrastructure/appointments.mock";
import { getPaymentsMock } from "../../infrastructure/payments.mock";
import { formatMoney } from "../../../../shared/lib/formatMoney";

interface DashboardContentProps {
  visits: number;
  contacts: number;
  reviews: number;
  rating: number;
}

export const DashboardContent = ({}: DashboardContentProps) => {
  const appointments = useMemo(() => generateMockAppointments(), []);
  const payments = useMemo(() => getPaymentsMock(), []);

  // Datos para gráfico de citas por semana
  const appointmentsByWeek = useMemo(() => {
    const weekData = [0, 0, 0, 0]; // Últimas 4 semanas
    appointments.forEach((apt) => {
      const date = new Date(apt.date);
      const weekAgo = Math.floor(
        (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );
      if (weekAgo >= 0 && weekAgo < 4) {
        weekData[weekAgo] = (weekData[weekAgo] || 0) + 1;
      }
    });
    return weekData.reverse(); // Más reciente primero
  }, [appointments]);

  // Datos para gráfico de ingresos
  const incomeByWeek = useMemo(() => {
    const weekData = [0, 0, 0, 0];
    payments.forEach((payment) => {
      const date = new Date(payment.date);
      const weekAgo = Math.floor(
        (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 7)
      );
      if (weekAgo >= 0 && weekAgo < 4) {
        weekData[weekAgo] = (weekData[weekAgo] || 0) + payment.netAmount;
      }
    });
    return weekData.reverse();
  }, [payments]);

  // Distribución de estados de citas
  const appointmentStatus = useMemo(() => {
    const statusCount = {
      completed: 0,
      pending: 0,
      cancelled: 0,
    };
    appointments.forEach((apt) => {
      if (apt.status === "completed") statusCount.completed++;
      else if (apt.status === "pending") statusCount.pending++;
      else if (apt.status === "cancelled") statusCount.cancelled++;
    });
    return statusCount;
  }, [appointments]);

  const totalAppointments = appointments.length;
  const maxAppointments = Math.max(...appointmentsByWeek, 1);
  const maxIncome = Math.max(...incomeByWeek, 1);

  // Citas recientes
  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [appointments]);

  return (
    <Box sx={{ mt: 4 }}>
      <Grid2 container spacing={3}>
        {/* Gráfico de Citas por Semana */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e5e7eb", height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <CalendarToday sx={{ color: "#14b8a6", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Citas por Semana
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Últimas 4 semanas
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ position: "relative", height: 200 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-end"
                  sx={{ height: "100%" }}
                >
                  {appointmentsByWeek.map((count, index) => (
                    <Box key={index} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: `${(count / maxAppointments) * 160}px`,
                          bgcolor: "#14b8a6",
                          borderRadius: "4px 4px 0 0",
                          minHeight: count > 0 ? "8px" : "0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: "#0d9488",
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 1, fontWeight: 600 }}>
                        {count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                        Sem {4 - index}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Gráfico de Ingresos */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Card elevation={0} sx={{ border: "1px solid #e5e7eb", height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <AttachMoney sx={{ color: "#10b981", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Ingresos por Semana
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Últimas 4 semanas
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ position: "relative", height: 200 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-end"
                  sx={{ height: "100%" }}
                >
                  {incomeByWeek.map((income, index) => (
                    <Box key={index} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "100%",
                          height: `${(income / maxIncome) * 160}px`,
                          bgcolor: "#10b981",
                          borderRadius: "4px 4px 0 0",
                          minHeight: income > 0 ? "8px" : "0",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            bgcolor: "#059669",
                          },
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 1, fontWeight: 600 }}>
                        {formatMoney(income)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                        Sem {4 - index}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Gráfico de Pastel - Estados de Citas */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card elevation={0} sx={{ border: "1px solid #e5e7eb", height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <TrendingUp sx={{ color: "#3b82f6", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Estado de Citas
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Distribución actual
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      bgcolor: "#10b981",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Completadas
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {appointmentStatus.completed} citas (
                      {totalAppointments > 0
                        ? Math.round(
                            (appointmentStatus.completed / totalAppointments) * 100
                          )
                        : 0}
                      %)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      bgcolor: "#f59e0b",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Pendientes
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {appointmentStatus.pending} citas (
                      {totalAppointments > 0
                        ? Math.round(
                            (appointmentStatus.pending / totalAppointments) * 100
                          )
                        : 0}
                      %)
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      bgcolor: "#ef4444",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      Canceladas
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {appointmentStatus.cancelled} citas (
                      {totalAppointments > 0
                        ? Math.round(
                            (appointmentStatus.cancelled / totalAppointments) * 100
                          )
                        : 0}
                      %)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Citas Recientes */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Card elevation={0} sx={{ border: "1px solid #e5e7eb", height: "100%" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <People sx={{ color: "#8b5cf6", fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Citas Recientes
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Últimas 5 citas
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                {recentAppointments.map((apt) => (
                  <Paper
                    key={apt.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "#f9fafb",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {apt.patientName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {apt.reason}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="caption" fontWeight={600}>
                          {new Date(apt.date).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {apt.time}
                        </Typography>
                        <Box
                          sx={{
                            mt: 0.5,
                            display: "inline-block",
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor:
                              apt.status === "completed"
                                ? "#d1fae5"
                                : apt.status === "pending"
                                ? "#fef3c7"
                                : "#fee2e2",
                            color:
                              apt.status === "completed"
                                ? "#065f46"
                                : apt.status === "pending"
                                ? "#92400e"
                                : "#991b1b",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                          }}
                        >
                          {apt.status === "completed"
                            ? "Completada"
                            : apt.status === "pending"
                            ? "Pendiente"
                            : "Cancelada"}
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
    </Box>
  );
};

