import { httpClient, extractData } from "../../../shared/lib/http";
import type { PaginatedResponse } from "../../../shared/types/pagination";
import type { ConsultationPrice, CreateConsultationPriceRequest, UpdateConsultationPriceRequest } from "../types/ConsultationPrice.entity";

export const getConsultationPricesAPI = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ConsultationPrice>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<ConsultationPrice> }>(
    "/doctors/consultation-prices",
    { params }
  );
  return extractData(response);
};

export const createConsultationPriceAPI = async (
  data: CreateConsultationPriceRequest
): Promise<ConsultationPrice> => {
  const response = await httpClient.post<{ success: boolean; data: ConsultationPrice }>(
    "/doctors/consultation-prices",
    data
  );
  return extractData(response);
};

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

export const deleteConsultationPriceAPI = async (id: string): Promise<void> => {
  await httpClient.delete(`/doctors/consultation-prices/${id}`);
};
