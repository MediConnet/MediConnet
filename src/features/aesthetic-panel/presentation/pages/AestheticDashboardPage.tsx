import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import {
  Visibility,
  Group,
  Star,
  TrendingUp,
  CalendarToday,
  CheckCircle,
  People,
  Spa as SpaIcon,
  Storefront,
  AttachMoney,
} from "@mui/icons-material";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useAuthStore } from "../../../../app/store/auth.store";
import { ProfileSection } from "../../../doctor-panel/presentation/components/ProfileSection";
import { useDoctorDashboard } from "../../../doctor-panel/presentation/hooks/useDoctorDashboard";
import { useDoctorProfile } from "../../../doctor-panel/presentation/hooks/useDoctorProfile";
import { AestheticServicesTab } from "../components/AestheticServicesTab";
import { AdsSection } from "../../../doctor-panel/presentation/components/AdsSection";
import { ReviewsSection } from "../../../doctor-panel/presentation/components/ReviewsSection";
import { AppointmentsSection } from "../../../doctor-panel/presentation/components/AppointmentsSection";
import { onRealtimeEvent } from "../../../../shared/realtime/realtimeEvents";
import { PatientsSection } from "../../../doctor-panel/presentation/components/PatientsSection";
import { SettingsSection } from "../../../doctor-panel/presentation/components/SettingsSection";
import { getAppointmentsAPI } from "../../../doctor-panel/infrastructure/appointments.api";

type TabType =
  | "dashboard"
  | "profile"
  | "services"
  | "appointments"
  | "ads"
  | "reviews"
  | "reception"
  | "schedules";

export const AestheticDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const authStore = useAuthStore();
  const { user } = authStore;
  const { data: dashboardData, refetch: refetchDashboard } = useDoctorDashboard();
  const { profileData, refetch: refetchProfile } = useDoctorProfile();

  // Estado dinámico para citas reales
  const [appointments, setAppointments] = useState<any[]>([]);

  const fetchAestheticAppointments = async () => {
    try {
      const res = await getAppointmentsAPI();
      setAppointments(res.data ?? []);
    } catch (err) {
      console.error("Error cargando citas para el dashboard:", err);
    }
  };

  useEffect(() => {
    fetchAestheticAppointments();
    const off = onRealtimeEvent(({ name }) => {
      if (name === "appointment:created" || name === "appointment:updated") {
        fetchAestheticAppointments();
      }
    });
    return off;
  }, []);

  const currentTab = (searchParams.get("tab") || "dashboard") as TabType;

  const displayData =
    currentTab === "profile" && profileData
      ? profileData
      : dashboardData;

  const displayName = user?.name || "Centro Estético Glow & Spa";
  const userProfile = {
    name: displayName,
    roleLabel: "Centro Estético",
    initials: displayName.slice(0, 2).toUpperCase(),
    isActive: true,
  };

  // Citas para la campana de notificaciones del Header
  const headerAppointments = useMemo(() => {
    return appointments
      .filter((apt) => apt.status === "CONFIRMED" || apt.status === "PENDING")
      .map((apt) => ({
        id: apt.id,
        patientName: apt.patientName || apt.patient_name || apt.patient?.user?.name || "Cliente",
        date: apt.date || (apt.scheduledFor ? new Date(apt.scheduledFor).toISOString().split("T")[0] : ""),
        time: apt.time || (apt.scheduledFor ? new Date(apt.scheduledFor).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : ""),
        reason: apt.service_name || apt.specialty || apt.reason || "Tratamiento Estético",
      }));
  }, [appointments]);

  // Métricas reales del proveedor
  const visits = (user as any)?.provider?.profile_views || 0;
  const contacts = 0;
  const reviews = 0;
  const rating = 5.0;

  // Cálculo dinámico de citas por semana
  const appointmentsByWeek = useMemo(() => {
    const weekData = [0, 0, 0, 0];
    appointments.forEach((apt) => {
      const date = new Date(apt.date || apt.created_at);
      const weekAgo = Math.floor(
        (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 7),
      );
      if (weekAgo >= 0 && weekAgo < 4) {
        weekData[weekAgo] = (weekData[weekAgo] || 0) + 1;
      }
    });
    return weekData.reverse();
  }, [appointments]);

  const maxAppointments = Math.max(...appointmentsByWeek, 1);

  // Distribución dinámica de estados
  const appointmentStatus = useMemo(() => {
    const statusCount = {
      completed: 0,
      pending: 0,
      cancelled: 0,
    };
    appointments.forEach((apt) => {
      if (apt.status === "COMPLETED") statusCount.completed++;
      else if (apt.status === "CONFIRMED" || apt.status === "PENDING")
        statusCount.pending++;
      else if (apt.status === "CANCELLED") statusCount.cancelled++;
    });
    return statusCount;
  }, [appointments]);

  const totalAppointments = appointments.length;

  // Citas recientes dinámicas
  const recentAppointments = useMemo(() => {
    return appointments.slice(0, 5).map((apt) => ({
      id: apt.id,
      clientName: apt.patientName || apt.patient_name || apt.patient?.user?.name || "Cliente",
      service: apt.service_name || apt.specialty || apt.reason || "Tratamiento Estético",
      date: apt.date,
      time: apt.time,
      status: apt.status,
    }));
  }, [appointments]);

  return (
    <DashboardLayout
      role="PROVIDER"
      userProfile={userProfile}
      appointments={headerAppointments}
      notificationsVariant="professional"
      agendaPath="/dashboard/estetica?tab=agenda"
      onRefreshNotifications={fetchAestheticAppointments}
    >
      {/* ── TOP STATS CARDS (Matching Doctor Dashboard Style) ── */}
      {currentTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Visitas al perfil */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
                <Visibility className="text-pink-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Visitas al perfil</p>
            <p className="text-3xl font-bold text-gray-800">{visits}</p>
          </div>

          {/* Contactos */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
                <Group className="text-pink-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Contactos</p>
            <p className="text-3xl font-bold text-gray-800">{contacts}</p>
          </div>

          {/* Reseñas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Star className="text-purple-500" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Reseñas</p>
            <p className="text-3xl font-bold text-gray-800">{reviews}</p>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Star className="text-yellow-500 fill-current" />
              </div>
              <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center">
                <TrendingUp className="text-orange-500 text-sm" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Rating</p>
            <p className="text-3xl font-bold text-gray-800">{rating}</p>
          </div>
        </div>
      )}

      {/* ── CONTENT ACCORDING TO ACTIVE TAB ── */}
      <Box className="mt-2">
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {currentTab === "dashboard" && (
          <Box>
            <Box mb={3}>
              <Typography variant="h4" fontWeight={700} mb={1}>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Resumen de tus estadísticas y métricas principales
              </Typography>
            </Box>

            <Grid2 container spacing={3}>
              {/* Gráfico de Citas por Semana */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Card
                  elevation={0}
                  sx={{ border: "1px solid #e5e7eb", height: "100%" }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                      <CalendarToday sx={{ color: "#db2777", fontSize: 28 }} />
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
                          <Box
                            key={index}
                            sx={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: `${(count / maxAppointments) * 160}px`,
                                bgcolor: "#db2777",
                                borderRadius: "4px 4px 0 0",
                                minHeight: count > 0 ? "8px" : "0",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  bgcolor: "#be185d",
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ mt: 1, fontWeight: 600 }}
                            >
                              {count}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontSize: "0.65rem" }}
                            >
                              Sem {4 - index}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>

              {/* Card de Modalidad de Cobro */}
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Card
                  elevation={0}
                  sx={{ border: "1px solid #e5e7eb", height: "100%" }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                      <CheckCircle sx={{ color: "#10b981", fontSize: 28 }} />
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Modalidad de Cobro
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Condiciones de pago del establecimiento
                        </Typography>
                      </Box>
                    </Stack>

                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Storefront sx={{ color: "#047857", fontSize: 28 }} />
                        <Typography variant="h6" fontWeight={700} color="#047857">
                          100% Pago Presencial
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="#065f46" lineHeight={1.6}>
                        Todos los cobros de tus tratamientos estéticos se realizan de forma directa en tu local (efectivo, tarjeta física o transferencia local).
                      </Typography>

                      <Box display="flex" gap={1} mt={1}>
                        <Chip label="Sin comisiones digitales" size="small" sx={{ bgcolor: "#d1fae5", color: "#047857", fontWeight: 600 }} />
                        <Chip label="Cobro en local" size="small" sx={{ bgcolor: "#d1fae5", color: "#047857", fontWeight: 600 }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid2>

              {/* Distribución - Estado de Citas */}
              <Grid2 size={{ xs: 12, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{ border: "1px solid #e5e7eb", height: "100%" }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                      <TrendingUp sx={{ color: "#9333ea", fontSize: 28 }} />
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
                      {/* Completadas */}
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
                            {Math.round(
                              (appointmentStatus.completed / totalAppointments) * 100,
                            )}
                            %)
                          </Typography>
                        </Box>
                      </Box>

                      {/* Pendientes */}
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
                            {Math.round(
                              (appointmentStatus.pending / totalAppointments) * 100,
                            )}
                            %)
                          </Typography>
                        </Box>
                      </Box>

                      {/* Canceladas */}
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
                            {Math.round(
                              (appointmentStatus.cancelled / totalAppointments) * 100,
                            )}
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
                <Card
                  elevation={0}
                  sx={{ border: "1px solid #e5e7eb", height: "100%" }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                      <People sx={{ color: "#db2777", fontSize: 28 }} />
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Citas Recientes
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Últimas reservas recibidas
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
                            "&:hover": { bgcolor: "#fDF2F8" },
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {apt.clientName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {apt.service}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: "right" }}>
                              <Typography variant="caption" fontWeight={600}>
                                {new Date(apt.date).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                })}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
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
                                    apt.status === "COMPLETED"
                                      ? "#d1fae5"
                                      : apt.status === "CONFIRMED"
                                        ? "#fef3c7"
                                        : "#fee2e2",
                                  color:
                                    apt.status === "COMPLETED"
                                      ? "#065f46"
                                      : apt.status === "CONFIRMED"
                                        ? "#92400e"
                                        : "#991b1b",
                                  fontSize: "0.65rem",
                                  fontWeight: 600,
                                }}
                              >
                                {apt.status === "COMPLETED"
                                  ? "Completada"
                                  : apt.status === "CONFIRMED"
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
        )}

        {/* TAB 2: PROFILE */}
        {currentTab === "profile" && displayData && (
          <ProfileSection
            data={displayData}
            isAesthetic={true}
            onUpdate={() => {
              refetchProfile();
              refetchDashboard();
            }}
          />
        )}

        {/* TAB 3: SERVICES CATALOG (FULL CRUD) */}
        {currentTab === "services" && <AestheticServicesTab />}

        {/* TAB 4: APPOINTMENTS */}
        {currentTab === "appointments" && <AppointmentsSection isAesthetic={true} />}

        {/* TAB 5: ADS / ANUNCIOS */}
        {currentTab === "ads" && <AdsSection isAesthetic={true} />}

        {/* TAB 6: REVIEWS / RESEÑAS */}
        {currentTab === "reviews" && <ReviewsSection isAesthetic={true} />}

        {/* TAB 7: RECEPTION (PATIENTS & CLIENTS CONTROL) */}
        {currentTab === "reception" && <PatientsSection isAesthetic={true} />}

        {/* TAB 8: SCHEDULES / CONFIGURACIÓN DE HORARIOS */}
        {currentTab === "schedules" && <SettingsSection isAesthetic={true} />}
      </Box>
    </DashboardLayout>
  );
};
