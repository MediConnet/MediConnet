import type { AmbulanceSettings } from "../domain/ambulance-settings.entity";

export const MOCK_SETTINGS: AmbulanceSettings = {
  notifications: {
    newReviews: true,
    whatsappContacts: true,
  },
};

export const getAmbulanceSettingsMock = (): Promise<AmbulanceSettings> => {
  return Promise.resolve(MOCK_SETTINGS);
};