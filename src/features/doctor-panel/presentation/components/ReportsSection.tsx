import { AttachMoney, BarChart, People, TrendingUp } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useEffect, useMemo, useState } from "react";
// --- CAMBIO: Imports correctos (API Real + Entidades) ---
// --- CAMBIO: Imports correctos (API Real + Entidades) ---
import type { DoctorAppointment } from "../../domain/Appointment.entity";
import { getAppointmentsAPI } from "../../infrastructure/appointments.api";
import { getPaymentsMock } from "../../infrastructure/payments.mock";
// --------------------------------------------------------
import { formatMoney } from "../../../../shared/lib/formatMoney";

export const ReportsSection = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargamos los pagos del mock (ya que el backend de pagos aún no está listo)
  const payments = useMemo(() => getPaymentsMock(), []);

  // 1. Cargar citas desde la API Real
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAppointmentsAPI();
        setAppointments(data);
      } catch (error) {
        console.error("Error loading appointments for reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Filtrar datos por fecha
  const filteredData = useMemo(() => {
    let filteredAppointments = appointments;
    let filteredPayments = payments;

    if (startDate) {
      filteredAppointments = filteredAppointments.filter(
        (apt) => apt.date >= startDate,
      );
      filteredPayments = filteredPayments.filter((p) => p.date >= startDate);
    }

    if (endDate) {
      filteredAppointments = filteredAppointments.filter(
        (apt) => apt.date <= endDate,
      );
      filteredPayments = filteredPayments.filter((p) => p.date <= endDate);
    }

    return { filteredAppointments, filteredPayments };
  }, [startDate, endDate, appointments, payments]);

  // 3. Calcular Estadísticas
  const stats = useMemo(() => {
    // Nota: El backend devuelve 'COMPLETED' (mayúsculas)
    const completedAppointments = filteredData.filteredAppointments.filter(
      (apt) => apt.status === "COMPLETED",
    );

    // Sumar ingresos (usamos el mock de pagos por ahora)
    const totalIncome = filteredData.filteredPayments.reduce(
      (sum, p) => sum + p.netAmount,
      0,
    );

    // Contar pacientes únicos
    const uniquePatients = new Set(
      filteredData.filteredAppointments.map((apt) => apt.patientName),
    ).size;

    return {
      totalAppointments: filteredData.filteredAppointments.length,
      completedAppointments: completedAppointments.length,
      totalIncome,
      patientsAttended: uniquePatients,
    };
  }, [filteredData]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Reportes</h3>
          <p className="text-sm text-gray-500 mt-1">
            Indicadores de rendimiento en tiempo real
          </p>
        </div>
      </div>

      {/* Filtros de fecha */}
      <Box mb={4}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Fecha de inicio"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Fecha de fin"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid2>
        </Grid2>
      </Box>

      {/* Loading state o Contenido */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">
          Calculando estadísticas...
        </div>
      ) : (
        <Grid2 container spacing={3}>
          {/* Total Citas */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{ bgcolor: "#eff6ff", border: "1px solid #bfdbfe" }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <BarChart sx={{ color: "#3b82f6", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total de Citas
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#3b82f6">
                      {stats.totalAppointments}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>

          {/* Citas Atendidas */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{ bgcolor: "#f0fdfa", border: "1px solid #a7f3d0" }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <TrendingUp sx={{ color: "#10b981", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Citas Atendidas
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#10b981">
                      {stats.completedAppointments}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>

          {/* Ingresos (Mocked por ahora) */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{ bgcolor: "#fef3c7", border: "1px solid #fde68a" }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AttachMoney sx={{ color: "#f59e0b", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Ingresos Generados
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#f59e0b">
                      {formatMoney(stats.totalIncome)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>

          {/* Pacientes Únicos */}
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              elevation={0}
              sx={{ bgcolor: "#f3e8ff", border: "1px solid #c4b5fd" }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <People sx={{ color: "#8b5cf6", fontSize: 32 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Pacientes Atendidos
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="#8b5cf6">
                      {stats.patientsAttended}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      )}
    </div>
  );
};
