import {
  Assignment,
  Campaign,
  Dashboard,
  MedicalServices,
  Person,
  Settings,
  StarRate,
  Timeline,
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

// Menú para el PROVEEDOR (Médico/Farmacia)
export const PROVIDER_MENU: MenuItem[] = [
  { icon: <Person />, label: "Mi Perfil", path: "/provider/profile" },
  { icon: <Campaign />, label: "Anuncios", path: "/provider/ads" },
  { icon: <StarRate />, label: "Reseñas", path: "/provider/reviews" },
  { icon: <Settings />, label: "Configuración", path: "/provider/settings" },
];

// Función helper para obtener el menú según el rol
export const getMenuByRole = (role: UserRole): MenuItem[] => {
  switch (role) {
    case "ADMIN":
      return ADMIN_MENU;
    case "PROVIDER":
      return PROVIDER_MENU;
    default:
      return [];
  }
};
