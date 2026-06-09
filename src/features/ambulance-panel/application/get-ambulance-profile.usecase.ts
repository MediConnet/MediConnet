import type { AmbulanceProfile } from "../domain/ambulance-profile.entity";
import { getAmbulanceProfileAPI } from "../infrastructure/ambulance.api";
import { getUserFriendlyMessage, logApiError } from "../../../shared/lib/api-error";
import { createLogger } from "../../../shared/lib/logger";

const ambulanceLog = createLogger("AmbulanceProfile");

export const getAmbulanceProfileUseCase = async (): Promise<AmbulanceProfile> => {
  try {
    ambulanceLog.info("Obteniendo perfil de ambulancia");
    return await getAmbulanceProfileAPI();
  } catch (error: unknown) {
    logApiError("AmbulanceProfile", error);
    throw new Error(
      getUserFriendlyMessage(error, { fallback: "No fue posible cargar el perfil." }),
    );
  }
};