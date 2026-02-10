import { useSearchParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useSupplyDashboard } from "../hooks/useSupplyDashboard";
import { useAuthStore } from "../../../../app/store/auth.store";
import { ProfileSection } from "../components/ProfileSection";
import { SuppliesScheduleSection } from "../components/SuppliesScheduleSection";
import { SuppliesContactLocationSection } from "../components/SuppliesContactLocationSection";
import { AdsSection } from "../components/AdsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { ProductsSection } from "../components/ProductsSection";
import { SettingsSection } from "../components/SettingsSection";
import { StatsCards } from "../components/StatsCards";
import { DashboardContent } from "../components/DashboardContent";
import { Stack } from "@mui/material";

type TabType = "dashboard" | "profile" | "ads" | "reviews" | "products" | "settings";

export const SupplyDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const { data, loading, setData, refetch } = useSupplyDashboard();
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
    name: user?.name || "Insumos Médicos",
    roleLabel: "Insumos Médicos",
    initials: getInitials(user?.name || "IM"),
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
          <div className="text-red-500">Error al cargar los datos del dashboard</div>
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
      <div className={currentTab === "dashboard" || currentTab === "products" ? "" : "mt-6"}>
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
              reviews={data.reviews}
              rating={data.rating}
            />
          </Box>
        )}
        {currentTab === "profile" && (
          <Stack spacing={4}>
            <ProfileSection
              data={data}
              onUpdate={(updatedData) => {
                if (setData) {
                  setData(updatedData);
                } else {
                  refetch();
                }
              }}
            />
            <SuppliesScheduleSection
              data={data}
              onUpdate={(updatedData) => {
                if (setData) {
                  setData(updatedData);
                } else {
                  refetch();
                }
              }}
            />
            <SuppliesContactLocationSection
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
        )}
        {currentTab === "ads" && <AdsSection />}
        {currentTab === "reviews" && <ReviewsSection />}
        {currentTab === "products" && <ProductsSection />}
        {currentTab === "settings" && <SettingsSection />}
      </div>
    </DashboardLayout>
  );
};

