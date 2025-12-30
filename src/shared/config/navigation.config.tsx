import {
  Assignment,
  Campaign,
  Dashboard,
  MedicalServices,
  Person,
  Settings,
  StarRate,
  Timeline,
  CalendarToday,
} from "@mui/icons-material";

// Definimos los tipos de roles permitidos en el dashboard
export type UserRole = "ADMIN" | "PROVIDER";

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

// Menú para el ADMIN
export const ADMIN_MENU: MenuItem[] = [
  { icon: <Dashboard />, label: "Dashboard", path: "/admin/dashboard" },
  { icon: <Assignment />, label: "Solicitudes", path: "/admin/requests" },
  { icon: <MedicalServices />, label: "Servicios", path: "/admin/services" },
  { icon: <Timeline />, label: "Actividad", path: "/admin/activity" },
  { icon: <Settings />, label: "Configuración", path: "/admin/settings" },
];

// Menú para el PROVEEDOR (Médico/Farmacia/Laboratorio)
export const PROVIDER_MENU: MenuItem[] = [
  { icon: <Person />, label: "Mi Perfil", path: "/doctor/dashboard?tab=profile" },
  { icon: <Campaign />, label: "Anuncios", path: "/doctor/dashboard?tab=ads" },
  { icon: <StarRate />, label: "Reseñas", path: "/doctor/dashboard?tab=reviews" },
  { icon: <CalendarToday />, label: "Citas", path: "/doctor/dashboard?tab=appointments" },
  { icon: <Settings />, label: "Configuración", path: "/doctor/dashboard?tab=settings" },
];

// Función helper para obtener el menú según el rol
export const getMenuByRole = (role: UserRole, userType?: string | null): MenuItem[] => {
  switch (role) {
    case "ADMIN":
      return ADMIN_MENU;
    case "PROVIDER":
      // Si es laboratorio, usar rutas de laboratorio
      if (userType === 'lab') {
        return PROVIDER_MENU.map(item => ({
          ...item,
          path: item.path.replace('/doctor/dashboard', '/laboratory/dashboard')
        }));
      }
      // Por defecto, usar rutas de doctor
      return PROVIDER_MENU;
    default:
      return [];
  }
};
