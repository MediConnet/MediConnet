import { httpClient, extractData } from "../../../shared/lib/http";

/**
 * Obtiene los precios de consulta por especialidad del médico
 */
export const getConsultationPricesAPI = async (): Promise<Record<string, number>> => {
  const response = await httpClient.get<{ success: boolean; data: Record<string, number> }>(
    "/doctors/consultation-prices"
  );
  return extractData(response);
};

/**
 * Actualiza los precios de consulta por especialidad del médico
 */
export const updateConsultationPricesAPI = async (
  prices: Record<string, number>
): Promise<void> => {
  await httpClient.put("/doctors/consultation-prices", { prices });
};
