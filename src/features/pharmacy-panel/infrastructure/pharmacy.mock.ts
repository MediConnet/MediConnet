import type { PharmacyProfile } from "../domain/pharmacy-profile.entity";

export const MOCK_PHARMACY_PROFILE: PharmacyProfile = {
  id: "pharma-001",
  
  logoUrl: "https://ccelrecreo.com/wp-content/uploads/2024/07/Fybeca-El-Recreo.png",
  
  commercialName: "Farmacias Fybeca",
  
  // RUC Corporativo (Corporación GPF)
  ruc: "1790710319001", 
  
  description: "Somos parte de tu vida. Encuentra medicinas, productos de cuidado personal, belleza, maternidad y más. Calidad y servicio garantizado en todo el Ecuador.",
  
  websiteUrl: "www.fybeca.com",
  
  address: "Av. Amazonas N25 y Colón, Quito, Ecuador",
  
  status: "published",
  
  whatsapp: "+593 99 123 4567",
  
  location: {
    latitude: -0.1807,
    longitude: -78.4678,
    address: "Av. Amazonas N25 y Colón, Quito, Ecuador",
  },
  
  schedule: [
    { day: "monday", isOpen: true, startTime: "08:00", endTime: "22:00" },
    { day: "tuesday", isOpen: true, startTime: "08:00", endTime: "22:00" },
    { day: "wednesday", isOpen: true, startTime: "08:00", endTime: "22:00" },
    { day: "thursday", isOpen: true, startTime: "08:00", endTime: "22:00" },
    { day: "friday", isOpen: true, startTime: "08:00", endTime: "22:00" },
    { day: "saturday", isOpen: true, startTime: "09:00", endTime: "21:00" },
    { day: "sunday", isOpen: true, startTime: "10:00", endTime: "20:00" },
  ],
  
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