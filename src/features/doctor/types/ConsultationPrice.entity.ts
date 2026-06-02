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

export interface CreateConsultationPriceRequest {
  specialtyId: string;
  consultationType: string;
  price: number;
  description?: string;
  durationMinutes?: number;
}

export interface UpdateConsultationPriceRequest {
  consultationType?: string;
  price?: number;
  description?: string;
  durationMinutes?: number;
  isActive?: boolean;
}
