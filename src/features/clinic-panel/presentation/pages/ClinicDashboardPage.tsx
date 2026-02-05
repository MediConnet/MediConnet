import { Box, Typography, CircularProgress } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../../../app/store/auth.store";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useClinicDashboard } from "../hooks/useClinicDashboard";
import { StatsCards } from "../components/StatsCards";
import { DashboardCharts } from "../components/DashboardCharts";
import { ProfileSection } from "../components/ProfileSection";
import { DoctorsSection } from "../components/DoctorsSection";
import { AppointmentsSection } from "../components/AppointmentsSection";
import { ReceptionSection } from "../components/ReceptionSection";
import { SchedulesSection } from "../components/SchedulesSection";
import { ClinicPaymentsSection } from "../components/ClinicPaymentsSection";

type TabType =
  | "dashboard"
  | "profile"
  | "doctors"
  | "appointments"
  | "reception"
  | "schedules"
  | "payments";

export const ClinicDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const { data, loading, error } = useClinicDashboard();
  const authStore = useAuthStore();
  const { user } = authStore;

  const currentTab = (searchParams.get("tab") || "dashboard") as TabType;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Datos por defecto para evitar errores cuando no hay datos
  const defaultClinicProfile = {
    id: user?.id || "",
    name: user?.name || "Clínica",
    logoUrl: undefined,
    specialties: [],
    address: "",
    phone: "",
    whatsapp: "",
    generalSchedule: {
      monday: { enabled: false, startTime: "", endTime: "" },
      tuesday: { enabled: false, startTime: "", endTime: "" },
      wednesday: { enabled: false, startTime: "", endTime: "" },
      thursday: { enabled: false, startTime: "", endTime: "" },
      friday: { enabled: false, startTime: "", endTime: "" },
      saturday: { enabled: false, startTime: "", endTime: "" },
      sunday: { enabled: false, startTime: "", endTime: "" },
    },
    description: "",
    isActive: true,
  };

  const defaultData = {
    totalDoctors: 0,
    activeDoctors: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    clinic: defaultClinicProfile,
  };

  const displayData = data || defaultData;
  const clinic = displayData.clinic || defaultClinicProfile;

  const userProfile = {
    name: user?.name || "Administrador",
    roleLabel: clinic.name || "Clínica",
    initials: getInitials(user?.name || "AD"),
    isActive: true,
  };

  if (loading) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={userProfile} appointments={[]}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  // Mostrar error solo si hay un error real, no si simplemente no hay datos
  if (error && !data) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={userProfile} appointments={[]}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
          <Typography color="error">Error al cargar el dashboard: {error.message}</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="PROVIDER" userProfile={userProfile} appointments={[]}>
      <Box sx={{ p: 3, maxWidth: 1400, margin: "0 auto" }}>
        {currentTab === "dashboard" && (
          <>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              Dashboard - {clinic.name}
            </Typography>
            <StatsCards data={displayData} />
            <Box sx={{ mt: 4 }}>
              <DashboardCharts data={displayData} clinicId={clinic.id} />
            </Box>
          </>
        )}

        {currentTab === "profile" && <ProfileSection clinicId={clinic.id} />}

        {currentTab === "doctors" && <DoctorsSection clinicId={clinic.id} />}

        {currentTab === "appointments" && <AppointmentsSection clinicId={clinic.id} />}

        {currentTab === "reception" && <ReceptionSection clinicId={clinic.id} />}

        {currentTab === "schedules" && <SchedulesSection clinicId={clinic.id} />}

        {currentTab === "payments" && <ClinicPaymentsSection clinicId={clinic.id} />}
      </Box>
    </DashboardLayout>
  );
};
