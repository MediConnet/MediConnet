import {
  Assignment,
  AttachMoney,
  Biotech,
  Block,
  Business,
  CalendarToday,
  Campaign,
  Dashboard,
  Group,
  History,
  Inventory,
  LocalHospital,
  LocalPharmacy,
  LocalShipping,
  MedicalServices,
  Message,
  Notifications,
  Percent,
  Person,
  Receipt,
  Settings,
  StarRate,
  Store,
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
  {
    icon: <Campaign />,
    label: "Solicitudes de Anuncios",
    path: "/admin/ad-requests",
  },
  {
    icon: <MedicalServices />,
    label: "Servicios Aprobados",
    path: "/admin/services",
  },
  { icon: <History />, label: "Historial", path: "/admin/history" },
  { icon: <AttachMoney />, label: "Pagos", path: "/admin/payments" },
  { icon: <Percent />, label: "Comisiones", path: "/admin/commissions" },
  { icon: <Group />, label: "Usuarios", path: "/admin/users" },
  { icon: <Timeline />, label: "Actividad", path: "/admin/activity" },
  {
    icon: <Business />,
    label: "Cadenas de Farmacias",
    path: "/admin/pharmacy-chains",
  },
  { icon: <Settings />, label: "Configuración", path: "/admin/settings" },
];

// --- 2. MENÚ DOCTOR (Tabs) ---
export const DOCTOR_MENU: MenuItem[] = [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    path: "/doctor/dashboard",
  },
  {
    icon: <Person />,
    label: "Mi Perfil",
    path: "/doctor/dashboard?tab=profile",
  },
  {
    icon: <AttachMoney />,
    label: "Tarifas de Consulta",
    path: "/doctor/dashboard?tab=consultation-prices",
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
    icon: <Group />,
    label: "Pacientes",
    path: "/doctor/dashboard?tab=patients",
  },
  {
    icon: <Receipt />,
    label: "Pagos e Ingresos",
    path: "/doctor/dashboard?tab=payments",
  },
  {
    icon: <Timeline />,
    label: "Reportes",
    path: "/doctor/dashboard?tab=reports",
  },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/doctor/dashboard?tab=settings",
  },
];

// --- 2.1. MENÚ DOCTOR ASOCIADO A CLÍNICA (Tabs limitados) ---
export const CLINIC_ASSOCIATED_DOCTOR_MENU: MenuItem[] = [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    path: "/doctor/dashboard",
  },
  {
    icon: <Person />,
    label: "Mi Perfil",
    path: "/doctor/dashboard?tab=profile",
  },
  {
    icon: <CalendarToday />,
    label: "Mis Citas",
    path: "/doctor/dashboard?tab=appointments",
  },
  {
    icon: <Group />,
    label: "Pacientes",
    path: "/doctor/dashboard?tab=patients",
  },
  {
    icon: <Message />,
    label: "Recepción",
    path: "/doctor/dashboard?tab=reception",
  },
  {
    icon: <Settings />,
    label: "Horario Laboral",
    path: "/doctor/dashboard?tab=clinic-schedule",
  },
  {
    icon: <Block />,
    label: "Solicitar Bloqueos",
    path: "/doctor/dashboard?tab=date-blocks",
  },
  {
    icon: <Business />,
    label: "Cuenta Bancaria",
    path: "/doctor/dashboard?tab=bank-account",
  },
  {
    icon: <Notifications />,
    label: "Notificaciones",
    path: "/doctor/dashboard?tab=notifications",
  },
];

// --- 3. MENÚ AMBULANCIA (Tabs) ---
export const AMBULANCE_MENU: MenuItem[] = [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    path: "/provider/ambulance/dashboard",
  },
  {
    icon: <LocalShipping />,
    label: "Mi Perfil",
    path: "/provider/ambulance/dashboard?tab=profile",
  },
  {
    icon: <Campaign />,
    label: "Anuncios",
    path: "/provider/ambulance/ads",
  },
  {
    icon: <StarRate />,
    label: "Reseñas",
    path: "/provider/ambulance/reviews",
  },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/provider/ambulance/settings",
  },
];

// --- 4. MENÚ FARMACIA (Tabs) ---
export const PHARMACY_MENU: MenuItem[] = [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    path: "/provider/pharmacy/dashboard",
  },
  {
    icon: <LocalPharmacy />,
    label: "Mi Farmacia",
    path: "/provider/pharmacy/dashboard?tab=profile",
  },
  {
    icon: <Store />,
    label: "Sucursales",
    path: "/provider/pharmacy/branches",
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
    icon: <Dashboard />,
    label: "Dashboard",
    path: "/laboratory/dashboard",
  },
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
    icon: <Settings />,
    label: "Configuración",
    path: "/laboratory/dashboard?tab=settings",
  },
];

// --- 6. MENÚ INSUMOS MÉDICOS ---
export const SUPPLIES_MENU: MenuItem[] = [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    path: "/supply/dashboard",
  },
  {
    icon: <Person />,
    label: "Mi Perfil",
    path: "/supply/dashboard?tab=profile",
  },
  {
    icon: <Campaign />,
    label: "Anuncios",
    path: "/supply/dashboard?tab=ads",
  },
  {
    icon: <StarRate />,
    label: "Reseñas",
    path: "/supply/dashboard?tab=reviews",
  },
  {
    icon: <Inventory />,
    label: "Productos",
    path: "/supply/dashboard?tab=products",
  },
  {
    icon: <Settings />,
    label: "Configuración",
    path: "/supply/dashboard?tab=settings",
  },
];

// --- 7. MENÚ CLÍNICA ---
export const CLINIC_MENU: MenuItem[] = [
  {
    icon: <Dashboard />,
    label: "Dashboard",
    path: "/clinic/dashboard",
  },
  {
    icon: <LocalHospital />,
    label: "Perfil de Clínica",
    path: "/clinic/dashboard?tab=profile",
  },
  {
    icon: <Group />,
    label: "Gestión de Médicos",
    path: "/clinic/dashboard?tab=doctors",
  },
  {
    icon: <AttachMoney />,
    label: "Precios por Consulta",
    path: "/clinic/dashboard?tab=consultationPrices",
  },
  {
    icon: <CalendarToday />,
    label: "Agenda Centralizada",
    path: "/clinic/dashboard?tab=appointments",
  },
  {
    icon: <Receipt />,
    label: "Recepción / Control Diario",
    path: "/clinic/dashboard?tab=reception",
  },
  {
    icon: <AttachMoney />,
    label: "Pagos",
    path: "/clinic/dashboard?tab=payments",
  },
  {
    icon: <Business />,
    label: "Datos Bancarios",
    path: "/clinic/dashboard?tab=bankAccount",
  },
  {
    icon: <Settings />,
    label: "Configuración de Horarios",
    path: "/clinic/dashboard?tab=schedules",
  },
];

// --- FUNCIÓN HELPER ---
export const getMenuByRole = (
  role: UserRole,
  providerType?: string | null,
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
        case "laboratory":
          return LAB_MENU;
        case "supplies":
          return SUPPLIES_MENU;
        case "clinic":
          return CLINIC_MENU;
        default:
          return [];
      }

    case "PATIENT":
      return [];

    default:
      return [];
  }
};
