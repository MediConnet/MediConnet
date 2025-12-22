// NOTE: Configuración principal de rutas de la aplicación
// TODO: Agregar lazy loading de componentes para mejor performance

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { AppLayout } from '../../shared/layouts/AppLayout';
import { AuthLayout } from '../../shared/layouts/AuthLayout';

// Pages
import { AmbulanceTrackingPage } from '../../features/ambulance/presentation/pages/AmbulanceTrackingPage';
import { RequestAmbulancePage } from '../../features/ambulance/presentation/pages/RequestAmbulancePage';
import { LoginPage } from '../../features/auth/presentation/pages/LoginPage';
import { CheckoutPage } from '../../features/booking/presentation/pages/CheckoutPage';
import { DoctorProfilePage } from '../../features/doctors/presentation/pages/DoctorProfilePage';
import { HomePage } from '../../features/home/presentation/pages/HomePage';
import { SearchPage } from '../../features/search/presentation/pages/SearchPage';
import { SpecialtiesPage } from '../../features/search/presentation/pages/SpecialtiesPage';

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
          <Route path="/specialties" element={<SpecialtiesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/doctor/:id" element={<DoctorProfilePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
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

