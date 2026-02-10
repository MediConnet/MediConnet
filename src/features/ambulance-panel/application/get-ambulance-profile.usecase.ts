import type { AmbulanceProfile } from "../domain/ambulance-profile.entity";
import { getAmbulanceProfileAPI } from "../infrastructure/ambulance.api";

export const getAmbulanceProfileUseCase = async (): Promise<AmbulanceProfile> => {
  try {
    console.log("🔍 [AMBULANCE] Obteniendo perfil de ambulancia desde el backend...");
    const profile = await getAmbulanceProfileAPI();
    console.log("✅ [AMBULANCE] Perfil recibido del backend:", profile);
    return profile;
  } catch (error: any) {
    console.error("❌ [AMBULANCE] Error al obtener perfil del backend:", error);
    console.error("❌ [AMBULANCE] Detalles del error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    // Re-lanzar el error para que el componente lo maneje
    throw error;
  }
};