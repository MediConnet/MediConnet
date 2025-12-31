import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useSupplyDashboard } from "../hooks/useSupplyDashboard";
import { useAuthStore } from "../../../../app/store/auth.store";
import { ProfileSection } from "../components/ProfileSection";
import { AdsSection } from "../components/AdsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { OrdersSection } from "../components/OrdersSection";
import { ProductsSection } from "../components/ProductsSection";
import { SettingsSection } from "../components/SettingsSection";
import { StatsCards } from "../components/StatsCards";

type TabType = "profile" | "ads" | "reviews" | "orders" | "products" | "settings";

export const SupplyDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const { data, loading, setData, refetch } = useSupplyDashboard();
  const authStore = useAuthStore();
  const { user } = authStore;

  const currentTab = (searchParams.get("tab") || "profile") as TabType;

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
    <DashboardLayout role="PROVIDER" userProfile={userProfile}>
      {/* Cards de Estadísticas - No mostrar en la pestaña de pedidos */}
      {currentTab !== "orders" && currentTab !== "products" && <StatsCards data={data} />}

      {/* Contenido según la pestaña activa */}
      <div className={currentTab === "orders" || currentTab === "products" ? "" : "mt-6"}>
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
        {currentTab === "orders" && <OrdersSection />}
        {currentTab === "products" && <ProductsSection />}
        {currentTab === "settings" && <SettingsSection />}
      </div>
    </DashboardLayout>
  );
};

