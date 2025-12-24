/**
 * Estados de ambulancia
 */
export const AmbulanceStatus = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  ARRIVED: 'arrived',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type AmbulanceStatus = typeof AmbulanceStatus[keyof typeof AmbulanceStatus];





