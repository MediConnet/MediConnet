// ── Ecuadorian banks ──
export const ECUADOR_BANKS = [
  "Banco Pichincha",
  "Banco de Guayaquil",
  "Banco del Pacífico",
  "Banco Internacional",
  "Banco Produbanco",
  "Banco Bolivariano",
  "Banco General Rumiñahui",
  "Banco de Loja",
  "Banco Solidario",
  "Banco del Austro",
  "Banco Comercial de Manabí",
  "Banco D-Miro",
  "Banco Finca",
  "Banco ProCredit",
  "Banco Coopnacional",
  "Banco Amazonas",
  "Banco Capital",
  "Banco Litoral",
  "Banco Machala",
  "Banco Unión",
  "Banco Diners Club",
  "Otro",
] as const;

// ── Payment method values sent to/from backend ──
export const PAYMENT_METHOD_BACKEND = {
  CASH: "Efectivo",
  CARD: "Tarjeta de Crédito",
} as const;

// ── Payment method keys used in frontend ──
export type PaymentMethodKey = 'card' | 'cash' | 'both';

// ── Profile statuses ──
export const PROFILE_STATUSES = ["draft", "published", "suspended"] as const;
export type ProfileStatus = (typeof PROFILE_STATUSES)[number];
export const PROFILE_STATUS_LABELS: Record<ProfileStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  suspended: "Suspendido",
};

// ── Ambulance types ──
export const AMBULANCE_TYPES = ["basic", "advanced", "mobile-icu"] as const;
export type AmbulanceType = (typeof AMBULANCE_TYPES)[number];
export const AMBULANCE_TYPE_LABELS: Record<AmbulanceType, string> = {
  basic: "Básica",
  advanced: "Avanzada",
  "mobile-icu": "UCI Móvil",
};

// ── Ambulance availability ──
export const AMBULANCE_AVAILABILITY = ["24/7", "scheduled"] as const;
export type AmbulanceAvailability = (typeof AMBULANCE_AVAILABILITY)[number];
export const AMBULANCE_AVAILABILITY_LABELS: Record<AmbulanceAvailability, string> = {
  "24/7": "24/7 (Todo el día)",
  scheduled: "Por Horario",
};

// ── Ambulance request statuses ──
export const AMBULANCE_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// ── Supply order statuses ──
export const SUPPLY_ORDER_STATUSES = ["pending", "confirmed", "preparing", "shipped", "delivered", "cancelled"] as const;
export type SupplyOrderStatus = (typeof SUPPLY_ORDER_STATUSES)[number];
export const SUPPLY_ORDER_STATUS_LABELS: Record<SupplyOrderStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "En Proceso",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

// ── Reception statuses ──
export const RECEPTION_STATUSES = ["arrived", "not_arrived", "attended"] as const;
export type ReceptionStatus = (typeof RECEPTION_STATUSES)[number];
export const RECEPTION_STATUS_LABELS: Record<ReceptionStatus, string> = {
  arrived: "Llegó",
  not_arrived: "No llegó",
  attended: "Atendido",
};

// ── Provider types ──
export const PROVIDER_TYPES = ["doctor", "pharmacy", "laboratory", "ambulance", "supplies", "clinica"] as const;
export type ProviderType = (typeof PROVIDER_TYPES)[number];
export const PROVIDER_TYPE_LABELS: Record<ProviderType, string> = {
  doctor: "Médico",
  pharmacy: "Farmacia",
  laboratory: "Laboratorio",
  ambulance: "Ambulancia",
  supplies: "Insumos Médicos",
  clinica: "Clínica",
};

// ── Verification / request status ──
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;
export type RequestStatusType = keyof typeof REQUEST_STATUS;
export const REQUEST_STATUS_LABEL: Record<RequestStatusType, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
};

// ── Appointment status labels (display only) ──
export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
  COMPLETED: "Completada",
  scheduled: "Programada",
  confirmed: "Confirmada",
  attended: "Atendida",
  cancelled: "Cancelada",
  no_show: "No Asistió",
  pending: "Pendiente",
  PENDING_PAYMENT: "Pendiente de Pago",
  PROCESSING: "Procesando",
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "#4caf50",
  CANCELLED: "#f44336",
  COMPLETED: "#2196f3",
  scheduled: "#ff9800",
  confirmed: "#4caf50",
  attended: "#2196f3",
  cancelled: "#f44336",
  no_show: "#9e9e9e",
  pending: "#ff9800",
  PENDING_PAYMENT: "#ff9800",
  PROCESSING: "#2196f3",
};
