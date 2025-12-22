// NOTE: Constantes globales de la aplicación
// TODO: Agregar más constantes según sea necesario

/**
 * Rutas de la aplicación
 * Centralizadas aquí para facilitar el mantenimiento
 */
export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',
  SEARCH: '/search',
  DOCTOR_PROFILE: '/doctor/:id',
  REQUEST_AMBULANCE: '/ambulance/request',
  AMBULANCE_TRACKING: '/ambulance/tracking/:id',
  AMBULANCES: '/ambulances',
  AMBULANCE_DETAIL: '/ambulances/:id',
  CHECKOUT: '/checkout',
  APPOINTMENTS: '/appointments',
  PHARMACIES: '/pharmacies',
  PHARMACY_DETAIL: '/pharmacies/:id',
  PHARMACY_BRANCH: '/pharmacy-branch/:id',
  LABORATORIES: '/laboratories',
  LABORATORY_DETAIL: '/laboratories/:id',
} as const;

export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  ADMIN: 'admin',
} as const;

export const AMBULANCE_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

