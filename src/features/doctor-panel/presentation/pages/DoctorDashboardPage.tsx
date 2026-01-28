import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../../../app/store/auth.store";
import { DashboardLayout } from "../../../../shared/layouts/DashboardLayout";

// Hooks
import { useDoctorDashboard } from "../hooks/useDoctorDashboard";
import { useDoctorProfile } from "../hooks/useDoctorProfile";

// Componentes de secciones
import { AdsSection } from "../components/AdsSection";
import { AppointmentsSection } from "../components/AppointmentsSection";
import { DashboardContent } from "../components/DashboardContent";
import { PatientsSection } from "../components/PatientsSection";
import { PaymentsSection } from "../components/PaymentsSection";
import { ProfileSection } from "../components/ProfileSection";
import { ReportsSection } from "../components/ReportsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import { SettingsSection } from "../components/SettingsSection";
import { StatsCards } from "../components/StatsCards";

// Entidades y APIs
import type {
  DoctorDashboard,
  PaymentMethod,
  ProfileStatus,
} from "../../domain/DoctorDashboard.entity";
import { getAppointmentsAPI } from "../../infrastructure/appointments.api";

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
  const authStore = useAuthStore();
  const { user } = authStore;

  const {
    data: dashboardData,
    loading: dashboardLoading,
    setData: setDashboardData,
    refetch: refetchDashboard,
  } = useDoctorDashboard();

  const { profileData, refetch: refetchProfile } = useDoctorProfile();

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

  // EFECTO: Cargar citas reales para el layout (Sidebar)
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const allAppointments = await getAppointmentsAPI();
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

  // Datos por defecto para usuarios nuevos
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

  // --- LÓGICA DE SELECCIÓN DE DATOS ---
  const displayData =
    currentTab === "profile" && profileData
      ? profileData
      : dashboardData || defaultData;

  const userProfile = {
    name: user?.name || "Dr. Usuario",
    roleLabel: displayData?.doctor?.specialty
      ? Array.isArray(displayData.doctor.specialty)
        ? displayData.doctor.specialty[0]
        : displayData.doctor.specialty
      : "Médico",
    initials: getInitials(user?.name || "Dr. Usuario"),
    isActive: true,
  };

  // --- RENDERIZADO CONDICIONAL DE CARGA Y ERRORES ---

  if (dashboardLoading) {
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

  if (!dashboardData && !profileData) {
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
              refetchProfile();

              if (setDashboardData) {
                setDashboardData(updatedData);
              } else {
                refetchDashboard();
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
