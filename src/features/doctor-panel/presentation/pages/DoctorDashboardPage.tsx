import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react"; // Añadido useEffect y useState
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../../../app/store/auth.store";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
// Componentes de secciones
import { AdsSection } from "../components/AdsSection";
import { AppointmentsSection } from "../components/AppointmentsSection";
import { PatientsSection } from "../components/PatientsSection";
import { PaymentsSection } from "../components/PaymentsSection";
import { ProfileSection } from "../components/ProfileSection";
import { ReportsSection } from "../components/ReportsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { SettingsSection } from "../components/SettingsSection";
import { StatsCards } from "../components/StatsCards";
// IMPORT NUEVO: Usamos la API real en lugar del Mock eliminado
import type {
  DoctorDashboard,
  PaymentMethod,
  ProfileStatus,
} from "../../domain/DoctorDashboard.entity";
import { getAppointmentsAPI } from "../../infrastructure/appointments.api";
import { DashboardContent } from "../components/DashboardContent";

type TabType =
  | "dashboard"
  | "profile"
  | "ads"
  | "reviews"
  | "appointments"
  | "patients"
  | "payments"
  | "reports"
  | "settings";

export const DoctorDashboardPage = () => {
  const [searchParams] = useSearchParams();
  const { data, loading, setData, refetch } = useDoctorDashboard();
  const authStore = useAuthStore();
  const { user } = authStore;

  // Estado para las citas de la barra lateral (Notificaciones)
  const [sidebarAppointments, setSidebarAppointments] = useState<any[]>([]);

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

  // EFECTO NUEVO: Cargar citas reales para el layout
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Traemos las citas reales
        const allAppointments = await getAppointmentsAPI();

        // Filtramos solo las pendientes/confirmadas y tomamos las próximas 5
        // para no saturar la barra lateral
        const upcoming = allAppointments
          .filter((a) => a.status === "CONFIRMED" || a.status === "PENDING")
          .slice(0, 5)
          .map((apt) => ({
            id: apt.id,
            patientName: apt.patientName,
            date: apt.date,
            time: apt.time,
            reason: apt.reason,
          }));

        setSidebarAppointments(upcoming);
      } catch (error) {
        console.error("Error cargando citas para sidebar:", error);
      }
    };

    fetchAppointments();
  }, []);
  // Crear datos por defecto para usuarios nuevos (valores en 0, campos vacíos)
  const defaultData: DoctorDashboard = {
    visits: 0,
    contacts: 0,
    reviews: 0,
    rating: 0,
    doctor: {
      name: user?.name || "Dr. Usuario",
      specialty: "Médico",
      email: user?.email || "",
      whatsapp: "",
      address: "",
      price: 0,
      description: "",
      isActive: true,
      profileStatus: "draft" as ProfileStatus,
      paymentMethods: "both" as PaymentMethod,
    },
  };

  // Usar datos reales si existen, sino usar datos por defecto (para usuarios nuevos)
  const displayData = data || defaultData;

  // Crear userProfile de forma segura
  const userProfile = {
    name: user?.name || "Dr. Usuario",
    roleLabel: displayData?.doctor?.specialty || "Médico",
    initials: getInitials(user?.name || "Dr. Usuario"),
    isActive: true,
  };

  // Solo mostrar loading durante la carga inicial
  if (loading) {
    return (
      <DashboardLayout
        role="PROVIDER"
        userProfile={userProfile}
        appointments={[]}
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout
        role="PROVIDER"
        userProfile={userProfile}
        appointments={[]}
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-red-500">
            Error al cargar los datos del dashboard
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!data.doctor) {
    return (
      <DashboardLayout
        role="PROVIDER"
        userProfile={userProfile}
        appointments={[]}
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-yellow-500">
            Datos del perfil no disponibles. Por favor, completa tu perfil.
          </div>
        </div>
      </DashboardLayout>
    );
  }
  // SIEMPRE renderizar el contenido, usando datos por defecto si no hay datos (usuarios nuevos)

  return (
    <DashboardLayout
      role="PROVIDER"
      userProfile={userProfile}
      appointments={sidebarAppointments}
    >
      {/* Cards de Estadísticas - Solo mostrar en la pestaña de dashboard */}
      {currentTab === "dashboard" && <StatsCards data={displayData} />}

      {/* Contenido según la pestaña activa */}
      <div
        className={
          currentTab === "dashboard" || currentTab === "appointments"
            ? ""
            : "mt-6"
        }
      >
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
              visits={displayData.visits}
              contacts={displayData.contacts}
              reviews={displayData.reviews}
              rating={displayData.rating}
            />
          </Box>
        )}
        {currentTab === "profile" && (
          <ProfileSection
            data={displayData}
            onUpdate={(updatedData) => {
              if (setData) {
                setData(updatedData);
              } else {
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
