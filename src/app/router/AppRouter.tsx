// NOTE: Configuración principal de rutas de la aplicación
// TODO: Agregar lazy loading de componentes para mejor performance

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { AppLayout } from '../../shared/layouts/AppLayout';
import { AuthLayout } from '../../shared/layouts/AuthLayout';

// Pages
import { SearchPage } from '../../features/search/presentation/pages/SearchPage';
import { DoctorProfilePage } from '../../features/doctors/presentation/pages/DoctorProfilePage';
import { RequestAmbulancePage } from '../../features/ambulance/presentation/pages/RequestAmbulancePage';
import { AmbulanceTrackingPage } from '../../features/ambulance/presentation/pages/AmbulanceTrackingPage';
import { CheckoutPage } from '../../features/booking/presentation/pages/CheckoutPage';
import { LoginPage } from '../../features/auth/presentation/pages/LoginPage';
import { HomePage } from '../../features/home/presentation/pages/HomePage';
import { PharmaciesListPage } from '../../features/pharmacies/presentation/pages/PharmaciesListPage';
import { PharmacyDetailPage } from '../../features/pharmacies/presentation/pages/PharmacyDetailPage';
import { BranchDetailPage } from '../../features/pharmacies/presentation/pages/BranchDetailPage';
import { LaboratoriesPage } from '../../features/laboratories/ui/pages/LaboratoriesPage';
import { LaboratoryDetailPage } from '../../features/laboratories/ui/pages/LaboratoryDetailPage';
import { AmbulancesListPage } from '../../features/ambulance/presentation/pages/AmbulancesListPage';
import { AmbulanceDetailPage } from '../../features/ambulance/presentation/pages/AmbulanceDetailPage';
import { SuppliesListPage } from '../../features/supplies/presentation/pages/SuppliesListPage';
import { SupplyStoreDetailPage } from '../../features/supplies/presentation/pages/SupplyStoreDetailPage';

// Placeholder pages
const RegisterPage = () => <div>Register Page</div>;

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/doctor/:id" element={<DoctorProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
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

        {/* Rutas de ambulancia */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/ambulance/request" element={<RequestAmbulancePage />} />
          <Route path="/ambulance/tracking/:id" element={<AmbulanceTrackingPage />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

