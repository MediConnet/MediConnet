/**
 * Entidad que representa un tipo de consulta con su precio
 */
export interface ConsultationPrice {
  id: string;
  specialtyId: string;
  specialtyName: string;
  consultationType: string;
  price: number;
  description?: string;
  durationMinutes?: number;
  isActive: boolean;
}

/**
 * Request para crear un nuevo tipo de consulta
 */
export interface CreateConsultationPriceRequest {
  specialtyId: string;
  consultationType: string;
  price: number;
  description?: string;
  durationMinutes?: number;
}

/**
 * Request para actualizar un tipo de consulta
 */
export interface UpdateConsultationPriceRequest {
  consultationType?: string;
  price?: number;
  description?: string;
  durationMinutes?: number;
  isActive?: boolean;
}
