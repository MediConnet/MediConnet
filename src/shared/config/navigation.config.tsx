import {
  Assignment,
  Biotech,
  CalendarToday,
  Campaign,
  Dashboard,
  LocalPharmacy,
  LocalShipping,
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

// --- 2. MENÚ DOCTOR (Tabs) ---
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

// --- 3. MENÚ AMBULANCIA (Sub-rutas) ---
export const AMBULANCE_MENU: MenuItem[] = [
  {
    icon: <LocalShipping />,
    label: "Mi Unidad",
    path: "/provider/ambulance/dashboard",
  },
  { icon: <StarRate />, label: "Reseñas", path: "/provider/ambulance/reviews" },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/provider/ambulance/settings",
  },
];

// --- 4. MENÚ FARMACIA (Sub-rutas) ---
export const PHARMACY_MENU: MenuItem[] = [
  {
    icon: <LocalPharmacy />,
    label: "Mi Farmacia",
    path: "/provider/pharmacy/dashboard",
  },
  {
    icon: <Campaign />,
    label: "Anuncios",
    path: "/provider/pharmacy/ads",
  },
  {
    icon: <StarRate />,
    label: "Reseñas",
    path: "/provider/pharmacy/reviews",
  },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/provider/pharmacy/settings",
  },
];

// --- 5. MENÚ LABORATORIO ---
export const LAB_MENU: MenuItem[] = [
  {
    icon: <Biotech />,
    label: "Mi Laboratorio",
    path: "/laboratory/dashboard?tab=profile",
  },
  {
    icon: <Campaign />,
    label: "Anuncios",
    path: "/laboratory/dashboard?tab=ads",
  },
  {
    icon: <StarRate />,
    label: "Reseñas",
    path: "/laboratory/dashboard?tab=reviews",
  },
  {
    icon: <CalendarToday />,
    label: "Citas",
    path: "/laboratory/dashboard?tab=appointments",
  },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/laboratory/dashboard?tab=settings",
  },
];

// --- FUNCIÓN HELPER ---
export const getMenuByRole = (
  role: UserRole,
  providerType?: string | null
): MenuItem[] => {
  const normalizedRole = role.toUpperCase();

  switch (normalizedRole) {
    case "ADMIN":
      return ADMIN_MENU;

    case "PROVIDER":
    case "PROFESIONAL":
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
          return [];
      }

    case "PATIENT":
      return [];

    default:
      return [];
  }
};
