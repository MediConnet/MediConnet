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
import { ProtectedRoute } from "./ProtectedRoute";

// Layouts
import { AppLayout } from "../../shared/layouts/AppLayout";
import { AuthLayout } from "../../shared/layouts/AuthLayout";

// Pages - Auth & General
import { LoginPage } from "../../features/auth/presentation/pages/LoginPage";
import { RegisterPage } from "../../features/auth/presentation/pages/RegisterPage";
import { HomePage } from "../../features/home/presentation/pages/HomePage";
import { ServicesCatalogPage } from "../../features/home/presentation/pages/ServicesCatalogPage";
import { ProfilePage } from "../../features/profile/pages/ProfilePage";

// Pages - Admin
import { ActivityPage } from "../../features/activity-history/presentation/pages/ActivityPage";
import { AdminDashboardPage } from "../../features/admin-dashboard/presentation/pages/AdminDashboardPage";
import { RequestsPage } from "../../features/provider-requests/presentation/pages/RequestsPage";
import { ServicesDashboardPage } from "../../features/services-dashboard/presentation/pages/ServicesDashboardPage";
import { SettingsPage } from "../../features/settings/presentation/pages/SettingsPage";

// Pages - Doctor
import { AppointmentsPage } from "../../features/appointments/presentation/pages/AppointmentsPage";
import { DoctorDashboardPage } from "../../features/doctors/presentation/pages/DoctorDashboardPage";
import { DoctorProfilePage } from "../../features/doctors/presentation/pages/DoctorProfilePage";
import { DoctorsListPage } from "../../features/doctors/presentation/pages/DoctorsListPage";

// Pages - Ambulancia
import { AmbulanceDashboardPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceDashboardPage";
import { AmbulanceReviewsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceReviewsPage";
import { AmbulanceSettingsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceSettingsPage";

// Pages - Farmacia
import { PharmacyDashboardPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyDashboardPage";

// Pages - Laboratorio
import { LaboratoryDashboardPage } from "../../features/laboratories/presentation/pages/LaboratoryDashboardPage";

// Pages - Insumos Médicos
import { SupplyDashboardPage } from "../../features/supplies/presentation/pages/SupplyDashboardPage";

// Pages - Insumos & Checkout & Search
import { AmbulanceAdsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceAdsPage";
import { ForgotPasswordPage } from "../../features/auth/presentation/pages/ForgotPasswordPage";
import { CheckoutPage } from "../../features/booking/presentation/pages/CheckoutPage";
import { PharmacyAdsPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyAdsPage";
import { PharmacyReviewsPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyReviewsPage";
import { PharmacySettingsPage } from "../../features/pharmacy-panel/presentation/pages/PharmacySettingsPage";
import { SearchPage } from "../../features/search/presentation/pages/SearchPage";
import { SpecialtiesPage } from "../../features/search/presentation/pages/SpecialtiesPage";
import { SuppliesListPage } from "../../features/supplies/presentation/pages/SuppliesListPage";
import { SupplyStoreDetailPage } from "../../features/supplies/presentation/pages/SupplyStoreDetailPage";

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
          <Route path="/specialties" element={<SpecialtiesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/supplies" element={<SuppliesListPage />} />
          <Route path="/supplies/:id" element={<SupplyStoreDetailPage />} />
        </Route>

        {/* --- Panel de Administrador --- */}
        <Route path="/admin" element={<Outlet />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="services" element={<ServicesDashboardPage />} />
          <Route path="activity" element={<ActivityPage />} />
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
            <Route path="ads" element={<PharmacyAdsPage />} />
            <Route path="reviews" element={<PharmacyReviewsPage />} />
            <Route path="settings" element={<PharmacySettingsPage />} />
          </Route>
        </Route>

        {/* --- Rutas Protegidas Generales (Pacientes) --- */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/doctor/:id" element={<DoctorProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/specialties/:specialtyName"
            element={<DoctorsListPage />}
          />
        </Route>

        {/* --- Fallback --- */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
