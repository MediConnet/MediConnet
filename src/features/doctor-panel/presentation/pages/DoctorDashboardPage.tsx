import { useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { useAuthStore } from "../../../../app/store/auth.store";
import { ProfileSection } from "../components/ProfileSection";
import { AdsSection } from "../components/AdsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { SettingsSection } from "../components/SettingsSection";
import { AppointmentsSection } from "../components/AppointmentsSection";
import { PatientsSection } from "../components/PatientsSection";
import { PaymentsSection } from "../components/PaymentsSection";
import { ReportsSection } from "../components/ReportsSection";
import { StatsCards } from "../components/StatsCards";
import { DashboardContent } from "../components/DashboardContent";
import { generateMockAppointments } from "../../infrastructure/appointments.mock";

type TabType = "dashboard" | "profile" | "ads" | "reviews" | "appointments" | "patients" | "payments" | "reports" | "settings";

export const DoctorDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const { data, loading, setData, refetch } = useDoctorDashboard();
  const authStore = useAuthStore();
  const { user } = authStore;

  const currentTab = (searchParams.get("tab") || "dashboard") as TabType;

  // Obtener iniciales del usuario
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userProfile = {
    name: user?.name || "Dr. Usuario",
    roleLabel: data?.doctor.specialty || "Médico",
    initials: getInitials(user?.name || "Dr. Usuario"),
    isActive: true,
  };

  // Obtener citas para las notificaciones
  const appointments = generateMockAppointments().map((apt) => ({
    id: apt.id,
    patientName: apt.patientName,
    date: apt.date,
    time: apt.time,
    reason: apt.reason,
  }));

  if (loading) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={userProfile} appointments={appointments}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={userProfile} appointments={appointments}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-red-500">Error al cargar los datos del dashboard</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="PROVIDER" userProfile={userProfile} appointments={appointments}>
      {/* Cards de Estadísticas - Solo mostrar en la pestaña de dashboard */}
      {currentTab === "dashboard" && <StatsCards data={data} />}

      {/* Contenido según la pestaña activa */}
      <div className={currentTab === "dashboard" || currentTab === "appointments" ? "" : "mt-6"}>
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
            <DashboardContent
              visits={data.visits}
              contacts={data.contacts}
              reviews={data.reviews}
              rating={data.rating}
            />
          </Box>
        )}
        {currentTab === "profile" && (
          <ProfileSection
            data={data}
            onUpdate={(updatedData) => {
              // Actualizar los datos directamente sin recargar
              if (setData) {
                setData(updatedData);
              } else {
                // Fallback: recargar si setData no está disponible
                refetch();
              }
            }}
          />
        )}
        {currentTab === "ads" && <AdsSection />}
        {currentTab === "reviews" && <ReviewsSection />}
        {currentTab === "appointments" && <AppointmentsSection />}
        {currentTab === "patients" && <PatientsSection />}
        {currentTab === "payments" && <PaymentsSection />}
        {currentTab === "reports" && <ReportsSection />}
        {currentTab === "settings" && <SettingsSection />}
      </div>
    </DashboardLayout>
  );
};
