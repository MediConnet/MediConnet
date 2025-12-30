import type { AmbulanceProfile } from "../domain/ambulance-profile.entity";

export const MOCK_AMBULANCE_PROFILE: AmbulanceProfile = {
  id: "amb-123",
  bannerUrl: "https://images.unsplash.com/photo-1584555613497-9ecf9dd06f68?q=80&w=2070&auto=format&fit=crop",
  commercialName: "Ambulancias VidaRápida",
  shortDescription: "Servicio de ambulancia 24/7. Unidades de terapia intensiva móvil y traslados programados. Personal certificado.",
  address: "Av. 12 de Octubre N27-30 y Orellana, Quito",
  whatsappContact: "+593999999999",
  emergencyPhone: "+593987690101",
  stats: {
    profileViews: 1250,
    contactClicks: 320,
    averageRating: 4.8,
    totalReviews: 45,
  },
};

export const getAmbulanceProfileMock = (): Promise<AmbulanceProfile> => {
  return new Promise((resolve) => {
    // Simula carga
    setTimeout(() => resolve(MOCK_AMBULANCE_PROFILE), 500);
  });
};