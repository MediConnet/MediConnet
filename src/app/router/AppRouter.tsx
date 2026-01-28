import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { DoctorRoute } from "./DoctorRoute";
import { LaboratoryRoute } from "./LaboratoryRoute";
import { SupplyRoute } from "./SupplyRoute";
import { ClinicRoute } from "./ClinicRoute";

// Layouts
import { AppLayout } from "../../shared/layouts/AppLayout";
import { AuthLayout } from "../../shared/layouts/AuthLayout";

// Pages - Auth & General
import { LoginPage } from "../../features/auth/presentation/pages/LoginPage";
import { RegisterPage } from "../../features/auth/presentation/pages/RegisterPage";
import { HomePage } from "../../features/home/presentation/pages/HomePage";
import { ServicesCatalogPage } from "../../features/home/presentation/pages/ServicesCatalogPage";

// Pages - Admin
import { ActivityPage } from "../../features/admin-dashboard/presentation/pages/ActivityPage";
import { AdminDashboardPage } from "../../features/admin-dashboard/presentation/pages/AdminDashboardPage";
import { RequestsPage } from "../../features/admin-dashboard/presentation/pages/RequestsPage";
import { AdRequestsPage } from "../../features/admin-dashboard/presentation/pages/AdRequestsPage";
import { ServicesDashboardPage } from "../../features/admin-dashboard/presentation/pages/ServicesDashboardPage";
import { PaymentsPage } from "../../features/admin-dashboard/presentation/pages/PaymentsPage";
import { CommissionsPage } from "../../features/admin-dashboard/presentation/pages/CommissionsPage";
import { UsersPage } from "../../features/admin-dashboard/presentation/pages/UsersPage";
import { HistoryPage } from "../../features/admin-dashboard/presentation/pages/RejectedServicesPage";
import { PharmacyChainsPage } from "../../features/admin-dashboard/presentation/pages/PharmacyChainsPage";

// Pages - Doctor
import { DoctorDashboardPage } from "../../features/doctor-panel/presentation/pages/DoctorDashboardPage";

// Pages - Ambulancia
import { AmbulanceDashboardPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceDashboardPage";
import { AmbulanceReviewsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceReviewsPage";
import { AmbulanceSettingsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceSettingsPage";

// Pages - Farmacia
import { PharmacyDashboardPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyDashboardPage";

// Pages - Laboratorio
import { LaboratoryDashboardPage } from "../../features/laboratory-panel/presentation/pages/LaboratoryDashboardPage";

// Pages - Insumos Médicos
import { SupplyDashboardPage } from "../../features/supplies-panel/presentation/pages/SupplyDashboardPage";

// Pages - Clínica
import { ClinicDashboardPage } from "../../features/clinic-panel/presentation/pages/ClinicDashboardPage";

// Pages - Insumos & Checkout & Search
import { SettingsPage } from "../../features/admin-dashboard/presentation/pages/SettingsPage";
import { AmbulanceAdsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceAdsPage";
import { ForgotPasswordPage } from "../../features/auth/presentation/pages/ForgotPasswordPage";
import { PharmacyAdsPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyAdsPage";
import { PharmacyBranchesPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyBranchesPage";
import { PharmacyReviewsPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyReviewsPage";
import { PharmacySettingsPage } from "../../features/pharmacy-panel/presentation/pages/PharmacySettingsPage";
import { SuppliesListPage } from "../../features/supplies-panel/presentation/pages/SuppliesListPage";
import { SupplyStoreDetailPage } from "../../features/supplies-panel/presentation/pages/SupplyStoreDetailPage";

export const AppRouter = () => {
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
