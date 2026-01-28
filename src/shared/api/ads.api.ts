import type { Ad } from "../domain/Ad.entity";
import { httpClient } from "../lib/http";

export interface CreateAdParams {
  label: string;
  discount: string;
  description: string;
  buttonText: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
}

interface CreateAdPayload {
  badge_text: string;
  discount_title: string; 
  description: string;
  button_text: string;
  image_url?: string | null;
  start_date: string;
  end_date?: string;
}

// ------------------------------------------------------------------
// FUNCIONES DE API
// ------------------------------------------------------------------

/**
 * Crea una nueva solicitud de anuncio.
 * Mapea los datos de CamelCase (Frontend) a SnakeCase (Backend).
 */
export const createAdAPI = async (params: CreateAdParams): Promise<void> => {
  // Mapeo: Frontend -> Backend
  const payload: CreateAdPayload = {
    badge_text: params.label,
    discount_title: params.discount,
    description: params.description,
    button_text: params.buttonText,
    image_url: params.imageUrl || null,
    start_date: params.startDate,
    end_date: params.endDate || undefined,
  };

  // POST: Crear el recurso
  await httpClient.post("/ads", payload);
};

/**
 * Obtiene el último anuncio o solicitud del proveedor actual.
 * Retorna null si no tiene ninguno o si da error 404.
 */
export const getMyAdAPI = async (): Promise<Ad | null> => {
  try {
    
    const response = await httpClient.get<any>("/ads");
    const adData = response.data?.data || response.data;

    return adData;
  } catch (error) {
    console.warn("No se pudo obtener el anuncio activo o no existe:", error);
    return null;
  }
};