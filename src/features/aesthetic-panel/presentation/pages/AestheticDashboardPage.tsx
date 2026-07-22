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
import { PatientsSection } from "../../../doctor-panel/presentation/components/PatientsSection";
import { SettingsSection } from "../../../doctor-panel/presentation/components/SettingsSection";

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

  // Métricas reales del proveedor
  const visits = (user as any)?.provider?.profile_views || 0;
  const contacts = 0;
  const reviews = 0;
  const rating = 5.0;

  const appointmentsByWeek = [2, 14, 8, 3];
  const maxAppointments = Math.max(...appointmentsByWeek, 1);

  const appointmentStatus = {
    completed: 18,
    pending: 7,
    cancelled: 2,
  };
  const totalAppointments = 27;

  const recentAppointments = [
    {
      id: "1",
      clientName: "María Fernánda López",
      service: "Limpieza Facial Profunda",
      date: "2026-07-21",
      time: "10:30 AM",
      status: "CONFIRMED",
    },
    {
      id: "2",
      clientName: "Carla Benítez",
      service: "Masaje Relajante Corporal",
      date: "2026-07-21",
      time: "03:00 PM",
      status: "COMPLETED",
    },
    {
      id: "3",
      clientName: "Valeria Gómez",
      service: "Peeling Químico Renovador",
      date: "2026-07-20",
      time: "11:00 AM",
      status: "COMPLETED",
    },
    {
      id: "4",
      clientName: "Andrea Morales",
      service: "Depilación Láser Diodo",
      date: "2026-07-19",
      time: "04:30 PM",
      status: "CANCELLED",
    },
  ];

  return (
    <DashboardLayout role="PROVIDER" userProfile={userProfile}>
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
