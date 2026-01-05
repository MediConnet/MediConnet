import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useLaboratoryDashboard } from "../hooks/useLaboratoryDashboard";
import { useAuthStore } from "../../../../app/store/auth.store";
import { ProfileSection } from "../components/ProfileSection";
import { AdsSection } from "../components/AdsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { SettingsSection } from "../components/SettingsSection";
import { AppointmentsSection } from "../components/AppointmentsSection";
import { StatsCards } from "../components/StatsCards";
import { generateMockAppointments } from "../../infrastructure/appointments.mock";

type TabType = "profile" | "ads" | "reviews" | "appointments" | "settings";

export const LaboratoryDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const { data, loading, setData, refetch } = useLaboratoryDashboard();
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
    name: user?.name || "Laboratorio",
    roleLabel: "Laboratorio",
    initials: getInitials(user?.name || "LAB"),
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
      {/* Cards de Estadísticas - No mostrar en la pestaña de citas */}
      {currentTab !== "appointments" && <StatsCards data={data} />}

      {/* Contenido según la pestaña activa */}
      <div className={currentTab === "appointments" ? "" : "mt-6"}>
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
        {currentTab === "settings" && <SettingsSection />}
      </div>
    </DashboardLayout>
  );
};

export default LaboratoryDashboardPage;
