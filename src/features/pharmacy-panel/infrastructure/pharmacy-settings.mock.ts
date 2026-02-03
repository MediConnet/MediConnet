import type { PharmacySettings } from "../domain/pharmacy-settings.entity";

export const MOCK_PHARMACY_SETTINGS: PharmacySettings = {
  notifications: {
    newReviews: true,
    whatsappContacts: true,
  },
};

export const getPharmacySettingsMock = (): Promise<PharmacySettings> => {
  return Promise.resolve(MOCK_PHARMACY_SETTINGS);
};