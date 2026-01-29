import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useAuthStore } from "../../app/store/auth.store";

// Guards / Rutas Protegidas
import { ClinicRoute } from "./ClinicRoute";
import { DoctorRoute } from "./DoctorRoute";
import { LaboratoryRoute } from "./LaboratoryRoute";
import { SupplyRoute } from "./SupplyRoute";

// Layouts
import { AppLayout } from "../../shared/layouts/AppLayout";
import { AuthLayout } from "../../shared/layouts/AuthLayout";

// Pages - Auth & General
import { ForgotPasswordPage } from "../../features/auth/presentation/pages/ForgotPasswordPage";
import { LoginPage } from "../../features/auth/presentation/pages/LoginPage";
import { RegisterPage } from "../../features/auth/presentation/pages/RegisterPage";
import { HomePage } from "../../features/home/presentation/pages/HomePage";
import { ServicesCatalogPage } from "../../features/home/presentation/pages/ServicesCatalogPage";

// Pages - Admin
import { ActivityPage } from "../../features/admin-dashboard/presentation/pages/ActivityPage";
import { AdRequestsPage } from "../../features/admin-dashboard/presentation/pages/AdRequestsPage";
import { AdminDashboardPage } from "../../features/admin-dashboard/presentation/pages/AdminDashboardPage";
import { CommissionsPage } from "../../features/admin-dashboard/presentation/pages/CommissionsPage";
import { PaymentsPage } from "../../features/admin-dashboard/presentation/pages/PaymentsPage";
import { PharmacyChainsPage } from "../../features/admin-dashboard/presentation/pages/PharmacyChainsPage";
import { HistoryPage } from "../../features/admin-dashboard/presentation/pages/RejectedServicesPage";
import { RequestsPage } from "../../features/admin-dashboard/presentation/pages/RequestsPage";
import { ServicesDashboardPage } from "../../features/admin-dashboard/presentation/pages/ServicesDashboardPage";
import { SettingsPage } from "../../features/admin-dashboard/presentation/pages/SettingsPage";
import { UsersPage } from "../../features/admin-dashboard/presentation/pages/UsersPage";

// Pages - Doctor
import { DoctorDashboardPage } from "../../features/doctor-panel/presentation/pages/DoctorDashboardPage";

// Pages - Ambulancia
import { AmbulanceAdsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceAdsPage";
import { AmbulanceDashboardPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceDashboardPage";
import { AmbulanceReviewsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceReviewsPage";
import { AmbulanceSettingsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceSettingsPage";

// Pages - Farmacia
import { PharmacyAdsPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyAdsPage";
import { PharmacyBranchesPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyBranchesPage";
import { PharmacyDashboardPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyDashboardPage";
import { PharmacyReviewsPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyReviewsPage";
import { PharmacySettingsPage } from "../../features/pharmacy-panel/presentation/pages/PharmacySettingsPage";

// Pages - Laboratorio
import { LaboratoryDashboardPage } from "../../features/laboratory-panel/presentation/pages/LaboratoryDashboardPage";

// Pages - Insumos Médicos
import { SuppliesListPage } from "../../features/supplies-panel/presentation/pages/SuppliesListPage";
import { SupplyDashboardPage } from "../../features/supplies-panel/presentation/pages/SupplyDashboardPage";
import { SupplyStoreDetailPage } from "../../features/supplies-panel/presentation/pages/SupplyStoreDetailPage";

// Pages - Clínica
import { ClinicDashboardPage } from "../../features/clinic-panel/presentation/pages/ClinicDashboardPage";
import { httpClient } from "../../shared/lib/http";

export const AppRouter = () => {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!token) return;

      try {
        await httpClient.get("/auth/me");
        console.log("✅ Sesión verificada correctamente");
      } catch (error) {
        console.error("❌ Sesión expirada o token inválido", error);
        logout();
      }
    };

    checkAuthStatus();
  }, [token, logout]);

  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rutas públicas (Auth) --- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* --- Rutas públicas con Layout Principal --- */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/services" element={<ServicesCatalogPage />} />
          <Route path="/supplies" element={<SuppliesListPage />} />
          <Route path="/supplies/:id" element={<SupplyStoreDetailPage />} />
        </Route>

        {/* --- Panel de Administrador --- */}
        <Route path="/admin" element={<Outlet />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="ad-requests" element={<AdRequestsPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="commissions" element={<CommissionsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="services" element={<ServicesDashboardPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="pharmacy-chains" element={<PharmacyChainsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* --- Panel de Doctor (Root level path) --- */}
        <Route
          path="/doctor"
          element={
            <DoctorRoute>
              <Outlet />
            </DoctorRoute>
          }
        >
          <Route path="dashboard" element={<DoctorDashboardPage />} />
        </Route>

        {/* --- Panel de Laboratorio --- */}
        <Route
          path="/laboratory"
          element={
            <LaboratoryRoute>
              <Outlet />
            </LaboratoryRoute>
          }
        >
          <Route path="dashboard" element={<LaboratoryDashboardPage />} />
        </Route>

        {/* --- Panel de Insumos Médicos --- */}
        <Route
          path="/supply"
          element={
            <SupplyRoute>
              <Outlet />
            </SupplyRoute>
          }
        >
          <Route path="dashboard" element={<SupplyDashboardPage />} />
        </Route>

        {/* --- Panel de Clínica --- */}
        <Route
          path="/clinic"
          element={
            <ClinicRoute>
              <Outlet />
            </ClinicRoute>
          }
        >
          <Route path="dashboard" element={<ClinicDashboardPage />} />
        </Route>

        {/* --- RUTAS DE PROVEEDORES (Estructura Anidada) --- */}
        <Route path="/provider" element={<Outlet />}>
          {/* 1. Panel Ambulancia */}
          <Route path="ambulance">
            <Route path="dashboard" element={<AmbulanceDashboardPage />} />
            <Route path="ads" element={<AmbulanceAdsPage />} />
            <Route path="reviews" element={<AmbulanceReviewsPage />} />
            <Route path="settings" element={<AmbulanceSettingsPage />} />
          </Route>

          {/* 2. Panel Farmacia */}
          <Route path="pharmacy">
            <Route path="dashboard" element={<PharmacyDashboardPage />} />
            <Route path="branches" element={<PharmacyBranchesPage />} />
            <Route path="ads" element={<PharmacyAdsPage />} />
            <Route path="reviews" element={<PharmacyReviewsPage />} />
            <Route path="settings" element={<PharmacySettingsPage />} />
          </Route>
        </Route>

        {/* --- Fallback --- */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
