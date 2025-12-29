export const RequestStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

// Tipo derivado de las llaves
export type RequestStatusType = keyof typeof RequestStatus;

// Helper para textos en español
export const RequestStatusLabel: Record<RequestStatusType, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
};