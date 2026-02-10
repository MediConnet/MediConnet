import { Box, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../../../app/store/auth.store";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { AdsSection } from "../components/AdsSection";
import { DashboardContent } from "../components/DashboardContent";
import { LaboratoryContactLocationSection } from "../components/LaboratoryContactLocationSection";
import { LaboratoryProfileSection } from "../components/LaboratoryProfileSection";
import { LaboratoryScheduleSection } from "../components/LaboratoryScheduleSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { ServicesSection } from "../components/ServicesSection";
import { SettingsSection } from "../components/SettingsSection";
import { StatsCards } from "../components/StatsCards";
import { useLaboratoryDashboard } from "../hooks/useLaboratoryDashboard";

type TabType = "dashboard" | "profile" | "ads" | "reviews" | "settings";

export const LaboratoryDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const { data, loading, setData, refetch } = useLaboratoryDashboard();
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
    name: user?.name || "Laboratorio",
    roleLabel: "Laboratorio",
    initials: getInitials(user?.name || "LAB"),
    isActive: true,
  };

  if (loading) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={userProfile}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout role="PROVIDER" userProfile={userProfile}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-red-500">
            Error al cargar los datos del dashboard
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      role="PROVIDER" 
      userProfile={userProfile}
      reviews={data.reviewsList || []}
      notificationType="reviews"
    >
      {/* Cards de Estadísticas - Solo mostrar en la pestaña de dashboard */}
      {currentTab === "dashboard" && <StatsCards data={data} />}

      {/* Contenido según la pestaña activa */}
      <div className={currentTab === "dashboard" ? "" : "mt-6"}>
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
              visits={data.visits || 0}
              reviews={data.reviews || 0}
              rating={data.rating || 0}
            />
          </Box>
        )}
        {currentTab === "profile" && (
          <Box>
            <Box mb={3}>
              <Typography variant="h4" fontWeight={700} mb={1}>
                Mi Laboratorio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona el perfil, servicios, horarios y contacto de tu
                laboratorio
              </Typography>
            </Box>
            <Stack spacing={4}>
              <LaboratoryProfileSection
                data={data}
                onUpdate={(updatedData) => {
                  if (setData) {
                    setData(updatedData);
                  } else {
                    refetch();
                  }
                }}
              />
              <ServicesSection
                data={data}
                onUpdate={(updatedData) => {
                  if (setData) {
                    setData(updatedData);
                  } else {
                    refetch();
                  }
                }}
              />
              <LaboratoryScheduleSection
                data={data}
                onUpdate={(updatedData) => {
                  if (setData) {
                    setData(updatedData);
                  } else {
                    refetch();
                  }
                }}
              />
              <LaboratoryContactLocationSection
                data={data}
                onUpdate={(updatedData) => {
                  if (setData) {
                    setData(updatedData);
                  } else {
                    refetch();
                  }
                }}
              />
            </Stack>
          </Box>
        )}
        {currentTab === "ads" && <AdsSection />}
        {currentTab === "reviews" && <ReviewsSection />}
        {currentTab === "settings" && <SettingsSection />}
      </div>
    </DashboardLayout>
  );
};

export default LaboratoryDashboardPage;
