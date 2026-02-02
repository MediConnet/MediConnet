import { Box, Card, CardContent, Typography, Grid2, LinearProgress, Chip } from "@mui/material";
import { TrendingUp, CalendarToday, People, CheckCircle, Schedule, Cancel } from "@mui/icons-material";
import { useMemo } from "react";
import type { ClinicDashboard } from "../../domain/clinic.entity";
import { useClinicAppointments } from "../hooks/useClinicAppointments";
// useClinicDoctors removed because not used in this component
// import { useClinicDoctors } from "../hooks/useClinicDoctors";

interface DashboardChartsProps {
  data: ClinicDashboard;
  clinicId: string;
}

export const DashboardCharts = ({ data: _data, clinicId }: DashboardChartsProps) => {
  const { appointments } = useClinicAppointments(clinicId);

  // Datos para gráfico de citas por semana (últimas 4 semanas)
  const appointmentsByWeek = useMemo(() => {
    const weekData = [0, 0, 0, 0];
    const now = Date.now();
    
    appointments.forEach((apt) => {
      const date = new Date(apt.date);
      const weekAgo = Math.floor((now - date.getTime()) / (1000 * 60 * 60 * 24 * 7));
      if (weekAgo >= 0 && weekAgo < 4) {
        weekData[weekAgo] = (weekData[weekAgo] || 0) + 1;
      }
    });
    return weekData.reverse(); // Más reciente primero
  }, [appointments]);

  // Distribución de estados de citas
  const appointmentStatus = useMemo(() => {
    const statusCount = {
      attended: 0,
      confirmed: 0,
      scheduled: 0,
      cancelled: 0,
      no_show: 0,
    };
    appointments.forEach((apt) => {
      const status = apt.status || "scheduled";
      if (status === "attended") statusCount.attended++;
      else if (status === "confirmed") statusCount.confirmed++;
      else if (status === "scheduled") statusCount.scheduled++;
      else if (status === "cancelled") statusCount.cancelled++;
      else if (status === "no_show") statusCount.no_show++;
    });
    return statusCount;
  }, [appointments]);

  // Citas recientes (últimas 5)
  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [appointments]);

  // Médicos más activos (por número de citas)
  const doctorsActivity = useMemo(() => {
    const doctorCounts: Record<string, { name: string; count: number }> = {};
    
    appointments.forEach((apt) => {
      const doctorId = apt.doctorId;
      const doctorName = apt.doctorName || "Sin nombre";
      if (!doctorCounts[doctorId]) {
        doctorCounts[doctorId] = { name: doctorName, count: 0 };
      }
      doctorCounts[doctorId].count++;
    });

    return Object.values(doctorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [appointments]);

  const maxAppointments = Math.max(...appointmentsByWeek, 1);
  const totalStatus = Object.values(appointmentStatus).reduce((a, b) => a + b, 0);

  return (
    <Grid2 container spacing={3}>
      {/* Gráfico de Citas por Semana */}
      <Grid2 size={{ xs: 12, lg: 8 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <TrendingUp sx={{ fontSize: 28, color: "#14b8a6", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Citas por Semana
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, height: 200, mt: 3 }}>
              {appointmentsByWeek.map((count, index) => {
                const height = (count / maxAppointments) * 100;
                const weekLabels = ["Hace 3 sem", "Hace 2 sem", "Sem pasada", "Esta sem"];
                return (
                  <Box key={index} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: "100%",
                        height: `${height}%`,
                        minHeight: count > 0 ? "20px" : "0",
                        backgroundColor: "#14b8a6",
                        borderRadius: "4px 4px 0 0",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        transition: "all 0.3s",
                        "&:hover": {
                          backgroundColor: "#0d9488",
                          transform: "scaleY(1.05)",
                        },
                      }}
                    >
                      {count > 0 && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: "12px",
                          }}
                        >
                          {count}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, fontSize: "11px", textAlign: "center" }}>
                      {weekLabels[index]}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Grid2>

      {/* Distribución de Estados */}
      <Grid2 size={{ xs: 12, lg: 4 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <CalendarToday sx={{ fontSize: 28, color: "#8b5cf6", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Estados de Citas
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { key: "attended", label: "Atendidas", color: "#10b981", icon: <CheckCircle /> },
                { key: "confirmed", label: "Confirmadas", color: "#3b82f6", icon: <Schedule /> },
                { key: "scheduled", label: "Agendadas", color: "#6366f1", icon: <CalendarToday /> },
                { key: "cancelled", label: "Canceladas", color: "#ef4444", icon: <Cancel /> },
                { key: "no_show", label: "No asistió", color: "#f59e0b", icon: <Cancel /> },
              ].map(({ key, label, color, icon }) => {
                const count = appointmentStatus[key as keyof typeof appointmentStatus];
                const percentage = totalStatus > 0 ? (count / totalStatus) * 100 : 0;
                return (
                  <Box key={key}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ color, fontSize: 18 }}>{icon}</Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color }}>
                        {count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#e5e7eb",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: color,
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Grid2>

      {/* Citas Recientes */}
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <CalendarToday sx={{ fontSize: 28, color: "#3b82f6", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Citas Recientes
              </Typography>
            </Box>
            {recentAppointments.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recentAppointments.map((apt) => (
                  <Box
                    key={apt.id}
                    sx={{
                      p: 2,
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "#f9fafb",
                        borderColor: "#14b8a6",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 1 }}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {apt.patientName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {apt.doctorName} • {apt.doctorSpecialty}
                        </Typography>
                      </Box>
                      <Chip
                        label={
                          apt.status === "attended"
                            ? "Atendida"
                            : apt.status === "confirmed"
                            ? "Confirmada"
                            : apt.status === "scheduled"
                            ? "Agendada"
                            : apt.status === "cancelled"
                            ? "Cancelada"
                            : "No asistió"
                        }
                        size="small"
                        color={
                          apt.status === "attended"
                            ? "success"
                            : apt.status === "confirmed"
                            ? "primary"
                            : apt.status === "cancelled"
                            ? "error"
                            : apt.status === "no_show"
                            ? "warning"
                            : "default"
                        }
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(apt.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      a las {apt.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                No hay citas recientes
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid2>

      {/* Médicos Más Activos */}
      <Grid2 size={{ xs: 12, lg: 6 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <People sx={{ fontSize: 28, color: "#10b981", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Médicos Más Activos
              </Typography>
            </Box>
            {doctorsActivity.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {doctorsActivity.map((doctor, index) => {
                  const maxCount = Math.max(...doctorsActivity.map((d) => d.count), 1);
                  const percentage = (doctor.count / maxCount) * 100;
                  return (
                    <Box key={index}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {doctor.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#10b981" }}>
                          {doctor.count} citas
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "#e5e7eb",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#10b981",
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                No hay datos de actividad
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
};
