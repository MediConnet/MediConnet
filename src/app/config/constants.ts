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
  CHECKOUT: '/checkout',
  APPOINTMENTS: '/appointments',
  SPECIALTIES: '/specialties',
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

