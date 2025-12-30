// NOTE: Configuración principal de rutas de la aplicación
// TODO: Agregar lazy loading de componentes para mejor performance

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { DoctorRoute } from "./DoctorRoute";
import { LaboratoryRoute } from "./LaboratoryRoute";
import { ProtectedRoute } from "./ProtectedRoute";

// Layouts
import { AppLayout } from "../../shared/layouts/AppLayout";
import { AuthLayout } from "../../shared/layouts/AuthLayout";

// Pages
import { ActivityPage } from "../../features/activity-history/presentation/pages/ActivityPage";
import { AdminDashboardPage } from "../../features/admin-dashboard/presentation/pages/AdminDashboardPage";
import { AmbulanceDashboardPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceDashboardPage";
import { AmbulanceReviewsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceReviewsPage";
import { AmbulanceSettingsPage } from "../../features/ambulance-panel/presentation/pages/AmbulanceSettingsPage";
import { AppointmentsPage } from "../../features/appointments/presentation/pages/AppointmentsPage";
import { LoginPage } from "../../features/auth/presentation/pages/LoginPage";
import { RegisterPage } from "../../features/auth/presentation/pages/RegisterPage";
import { CheckoutPage } from "../../features/booking/presentation/pages/CheckoutPage";
import { DoctorDashboardPage } from "../../features/doctors/presentation/pages/DoctorDashboardPage";
import { DoctorProfilePage } from "../../features/doctors/presentation/pages/DoctorProfilePage";
import { DoctorsListPage } from "../../features/doctors/presentation/pages/DoctorsListPage";
import { HomePage } from "../../features/home/presentation/pages/HomePage";
import { ServicesCatalogPage } from "../../features/home/presentation/pages/ServicesCatalogPage";
import { LaboratoryDashboardPage } from "../../features/laboratories/presentation/pages/LaboratoryDashboardPage";
import { PharmacyDashboardPage } from "../../features/pharmacy-panel/presentation/pages/PharmacyDashboardPage";
import { ProfilePage } from "../../features/profile/pages/ProfilePage";
import { RequestsPage } from "../../features/provider-requests/presentation/pages/RequestsPage";
import { SearchPage } from "../../features/search/presentation/pages/SearchPage";
import { SpecialtiesPage } from "../../features/search/presentation/pages/SpecialtiesPage";
import { ServicesDashboardPage } from "../../features/services-dashboard/presentation/pages/ServicesDashboardPage";
import { SettingsPage } from "../../features/settings/presentation/pages/SettingsPage";
import { SuppliesListPage } from "../../features/supplies/presentation/pages/SuppliesListPage";
import { SupplyStoreDetailPage } from "../../features/supplies/presentation/pages/SupplyStoreDetailPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Rutas públicas con AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/services" element={<ServicesCatalogPage />} />
          <Route path="/specialties" element={<SpecialtiesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/supplies" element={<SuppliesListPage />} />
          <Route path="/supplies/:id" element={<SupplyStoreDetailPage />} />
        </Route>

        {/* Rutas de Admin Dashboard */}
        <Route path="/admin" element={<Outlet />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="services" element={<ServicesDashboardPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Ruta del Doctor Dashboard */}
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

        {/* Rutas de Proveedores (Ambulancias y Farmacias) */}
        <Route path="/provider" element={<Outlet />}>
          {/* Ambulancia */}
          <Route path="ambulance">
            <Route path="dashboard" element={<AmbulanceDashboardPage />} />
            <Route path="reviews" element={<AmbulanceReviewsPage />} />
            <Route path="settings" element={<AmbulanceSettingsPage />} />
          </Route>

          {/* Farmacia */}
          <Route path="pharmacy">
            <Route path="dashboard" element={<PharmacyDashboardPage />} />
          </Route>
        </Route>

        {/* Ruta del Laboratory Dashboard - Solo accesible para laboratorios */}
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

        {/* Rutas protegidas */}
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

        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
