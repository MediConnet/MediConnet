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

export type UserRole = "ADMIN" | "PROVIDER" | "PATIENT" | string;

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

// --- 2. MENÚ DOCTOR ---
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

// --- 3. MENÚ AMBULANCIA ---
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

// --- 4. MENÚ FARMACIA ---
export const PHARMACY_MENU: MenuItem[] = [
  {
    icon: <Person />,
    label: "Mi Farmacia",
    path: "/provider/pharmacy/dashboard",
  },
  { icon: <StarRate />, label: "Reseñas", path: "/provider/pharmacy/reviews" },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/provider/pharmacy/settings",
  },
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
    case "PROFESIONAL":
      if (providerType === "ambulance") {
        return AMBULANCE_MENU;
      }

      if (providerType === "pharmacy") {
        return PHARMACY_MENU;
      }

      if (providerType === "doctor") {
        return DOCTOR_MENU;
      }

      return DOCTOR_MENU;

    default:
      return [];
  }
};
