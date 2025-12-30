// NOTE: Configuración principal de rutas de la aplicación
// TODO: Agregar lazy loading de componentes para mejor performance

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { DoctorRoute } from "./DoctorRoute";

// Layouts
import { AppLayout } from "../../shared/layouts/AppLayout";
import { AuthLayout } from "../../shared/layouts/AuthLayout";

// Pages
import { ActivityPage } from "../../features/activity-history/presentation/pages/ActivityPage";
import { AdminDashboardPage } from "../../features/admin-dashboard/presentation/pages/AdminDashboardPage";
import { AmbulanceDetailPage } from "../../features/ambulance/presentation/pages/AmbulanceDetailPage";
import { AmbulancesListPage } from "../../features/ambulance/presentation/pages/AmbulancesListPage";
import { AmbulanceTrackingPage } from "../../features/ambulance/presentation/pages/AmbulanceTrackingPage";
import { RequestAmbulancePage } from "../../features/ambulance/presentation/pages/RequestAmbulancePage";
import { AppointmentsPage } from "../../features/appointments/presentation/pages/AppointmentsPage";
import { LoginPage } from "../../features/auth/presentation/pages/LoginPage";
import { RegisterPage } from "../../features/auth/presentation/pages/RegisterPage";
import { CheckoutPage } from "../../features/booking/presentation/pages/CheckoutPage";
import { DoctorDashboardPage } from "../../features/doctors/presentation/pages/DoctorDashboardPage";
import { DoctorProfilePage } from "../../features/doctors/presentation/pages/DoctorProfilePage";
import { DoctorsListPage } from "../../features/doctors/presentation/pages/DoctorsListPage";
import { HomePage } from "../../features/home/presentation/pages/HomePage";
import { ServicesCatalogPage } from "../../features/home/presentation/pages/ServicesCatalogPage";
import { LaboratoriesPage } from "../../features/laboratories/ui/pages/LaboratoriesPage";
import { LaboratoryDetailPage } from "../../features/laboratories/ui/pages/LaboratoryDetailPage";
import { BranchDetailPage } from "../../features/pharmacies/presentation/pages/BranchDetailPage";
import { PharmaciesListPage } from "../../features/pharmacies/presentation/pages/PharmaciesListPage";
import { PharmacyDetailPage } from "../../features/pharmacies/presentation/pages/PharmacyDetailPage";
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
          <Route path="/pharmacies" element={<PharmaciesListPage />} />
          <Route path="/pharmacies/:id" element={<PharmacyDetailPage />} />
          <Route path="/pharmacy-branch/:id" element={<BranchDetailPage />} />
          <Route path="/laboratories" element={<LaboratoriesPage />} />
          <Route path="/laboratories/:id" element={<LaboratoryDetailPage />} />
          <Route path="/ambulances" element={<AmbulancesListPage />} />
          <Route path="/ambulances/:id" element={<AmbulanceDetailPage />} />
          <Route path="/supplies" element={<SuppliesListPage />} />
          <Route path="/supplies/:id" element={<SupplyStoreDetailPage />} />
        </Route>

        {/* Rutas de Admin Dashboard (públicas de momento)*/}
        <Route path="/admin" element={<Outlet />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="services" element={<ServicesDashboardPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Ruta del Doctor Dashboard - Solo accesible para doctores (debe ir antes de /doctor/:id) */}
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
          <Route path="/ambulance/request" element={<RequestAmbulancePage />} />
          <Route
            path="/ambulance/tracking/:id"
            element={<AmbulanceTrackingPage />}
          />
        </Route>

        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
