import { httpClient, extractData } from "../../../shared/lib/http";
import type { ConsultationPrice, CreateConsultationPriceRequest, UpdateConsultationPriceRequest } from "../domain/ConsultationPrice.entity";

/**
 * Obtiene todos los tipos de consulta del médico agrupados por especialidad
 */
export const getConsultationPricesAPI = async (): Promise<ConsultationPrice[]> => {
  const response = await httpClient.get<{ success: boolean; data: ConsultationPrice[] }>(
    "/doctors/consultation-prices"
  );
  return extractData(response);
};

/**
 * Crea un nuevo tipo de consulta
 */
export const createConsultationPriceAPI = async (
  data: CreateConsultationPriceRequest
): Promise<ConsultationPrice> => {
  const response = await httpClient.post<{ success: boolean; data: ConsultationPrice }>(
    "/doctors/consultation-prices",
    data
  );
  return extractData(response);
};

/**
 * Actualiza un tipo de consulta existente
 */
export const updateConsultationPriceAPI = async (
  id: string,
  data: UpdateConsultationPriceRequest
): Promise<ConsultationPrice> => {
  const response = await httpClient.put<{ success: boolean; data: ConsultationPrice }>(
    `/doctors/consultation-prices/${id}`,
    data
  );
  return extractData(response);
};

/**
 * Elimina un tipo de consulta
 */
export const deleteConsultationPriceAPI = async (id: string): Promise<void> => {
  await httpClient.delete(`/doctors/consultation-prices/${id}`);
};

