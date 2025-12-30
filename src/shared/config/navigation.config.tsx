import {
  Assignment,
  CalendarToday,
  Campaign,
  Dashboard,
  MedicalServices,
  Person,
  Settings,
  StarRate,
  Timeline,
} from "@mui/icons-material";

export type UserRole =
  | "ADMIN"
  | "PROVIDER"
  | "PATIENT"
  | "PROFESIONAL"
  | string;

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

// --- 1. MENÚ ADMIN ---
export const ADMIN_MENU: MenuItem[] = [
  { icon: <Dashboard />, label: "Dashboard", path: "/admin/dashboard" },
  { icon: <Assignment />, label: "Solicitudes", path: "/admin/requests" },
  { icon: <MedicalServices />, label: "Servicios", path: "/admin/services" },
  { icon: <Timeline />, label: "Actividad", path: "/admin/activity" },
  { icon: <Settings />, label: "Configuración", path: "/admin/settings" },
];

// --- 2. MENÚ DOCTOR (Usa query params ?tab=...) ---
export const DOCTOR_MENU: MenuItem[] = [
  {
    icon: <Person />,
    label: "Mi Perfil",
    path: "/doctor/dashboard?tab=profile",
  },
  { icon: <Campaign />, label: "Anuncios", path: "/doctor/dashboard?tab=ads" },
  {
    icon: <StarRate />,
    label: "Reseñas",
    path: "/doctor/dashboard?tab=reviews",
  },
  {
    icon: <CalendarToday />,
    label: "Citas",
    path: "/doctor/dashboard?tab=appointments",
  },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/doctor/dashboard?tab=settings",
  },
];

// --- 3. MENÚ AMBULANCIA (Usa sub-rutas /provider/ambulance/...) ---
export const AMBULANCE_MENU: MenuItem[] = [
  {
    icon: <Person />,
    label: "Mi Perfil",
    path: "/provider/ambulance/dashboard",
  },
  { icon: <StarRate />, label: "Reseñas", path: "/provider/ambulance/reviews" },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/provider/ambulance/settings",
  },
];

// --- 4. MENÚ FARMACIA (Usa sub-rutas /provider/pharmacy/...) ---
export const PHARMACY_MENU: MenuItem[] = [
  {
    icon: <Person />,
    label: "Mi Farmacia",
    path: "/provider/pharmacy/dashboard",
  },
  // Nota: Estas rutas deben existir en el AppRouter dentro de /provider/pharmacy
  { icon: <StarRate />, label: "Reseñas", path: "/provider/pharmacy/reviews" },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/provider/pharmacy/settings",
  },
];

// --- 5. MENÚ LABORATORIO (Usa ruta base /laboratory/...) ---
export const LAB_MENU: MenuItem[] = [
  { icon: <Person />, label: "Mi Laboratorio", path: "/laboratory/dashboard" },
  // Asumiendo que el laboratorio tendrá estructura similar en el futuro:
  { icon: <StarRate />, label: "Reseñas", path: "/laboratory/reviews" },
  { icon: <Settings />, label: "Configuración", path: "/laboratory/settings" },
];

// --- FUNCIÓN HELPER DINÁMICA ---
export const getMenuByRole = (
  role: UserRole,
  providerType?: string | null
): MenuItem[] => {
  const normalizedRole = role.toUpperCase();

  switch (normalizedRole) {
    case "ADMIN":
      return ADMIN_MENU;

    case "PROVIDER":
    case "PROFESIONAL": // Soporte para el rol legacy si existe en BD
      switch (providerType) {
        case "doctor":
          return DOCTOR_MENU;
        case "ambulance":
          return AMBULANCE_MENU;
        case "pharmacy":
          return PHARMACY_MENU;
        case "lab":
          return LAB_MENU;
        default:
          // Si es proveedor pero no tiene tipo definido, retornamos array vacío o un default
          return [];
      }

    case "PATIENT":
      // Retorna menú de paciente si lo tienes definido, o vacío
      return [];

    default:
      return [];
  }
};
