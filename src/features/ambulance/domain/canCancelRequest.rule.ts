import type { AmbulanceRequest } from './AmbulanceRequest.entity';
import { AmbulanceStatus } from './AmbulanceStatus.enum';

/**
 * Regla de negocio: Verificar si se puede cancelar una solicitud
 */
export const canCancelRequest = (
  request: AmbulanceRequest
): { canCancel: boolean; reason?: string } => {
  if (request.status === AmbulanceStatus.COMPLETED) {
    return { canCancel: false, reason: 'La solicitud ya fue completada' };
  }

  if (request.status === AmbulanceStatus.IN_TRANSIT) {
    return {
      canCancel: false,
      reason: 'La ambulancia ya está en camino',
    };
  }

  if (request.status === AmbulanceStatus.ARRIVED) {
    return {
      canCancel: false,
      reason: 'La ambulancia ya llegó',
    };
  }

  return { canCancel: true };
};





