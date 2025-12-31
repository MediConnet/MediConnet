import type { PharmacyProfile } from "../domain/pharmacy-profile.entity";

export const MOCK_PHARMACY_PROFILE: PharmacyProfile = {
  id: "pharma-001",
  bannerUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=2069&auto=format&fit=crop",
  commercialName: "Fybeca Centro",
  phone: "022567890", 
  whatsappContact: "0998765432", 
  address: "Av. Amazonas N23-50 y Wilson, Quito",
  hasDelivery: true,
  schedule: {
    daysSummary: "Lun - Dom",
    hoursSummary: "07:00 - 22:00"
  },
  stats: {
    profileViews: 850,
    contactClicks: 120,
    averageRating: 4.5,
    totalReviews: 24,
  },
};

export const getPharmacyProfileMock = (): Promise<PharmacyProfile> => {
  return Promise.resolve(MOCK_PHARMACY_PROFILE);
};