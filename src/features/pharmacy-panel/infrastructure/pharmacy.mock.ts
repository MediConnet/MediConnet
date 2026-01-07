import type { PharmacyProfile } from "../domain/pharmacy-profile.entity";

export const MOCK_PHARMACY_PROFILE: PharmacyProfile = {
  id: "pharma-001",
  
  logoUrl: "https://ccelrecreo.com/wp-content/uploads/2024/07/Fybeca-El-Recreo.png",
  
  commercialName: "Farmacias Fybeca",
  
  // RUC Corporativo (Corporación GPF)
  ruc: "1790710319001", 
  
  description: "Somos parte de tu vida. Encuentra medicinas, productos de cuidado personal, belleza, maternidad y más. Calidad y servicio garantizado en todo el Ecuador.",
  
  websiteUrl: "www.fybeca.com",
  
  stats: {
    profileViews: 1240,
    contactClicks: 350,
    averageRating: 4.8,
    totalReviews: 128,
  },
};

export const getPharmacyProfileMock = (): Promise<PharmacyProfile> => {
  return Promise.resolve(MOCK_PHARMACY_PROFILE);
};