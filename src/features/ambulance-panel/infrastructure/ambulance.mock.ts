import type { AmbulanceProfile } from "../domain/ambulance-profile.entity";

export const MOCK_AMBULANCE_PROFILE: AmbulanceProfile = {
  id: "amb-123",
  bannerUrl: "https://images.unsplash.com/photo-1584555613497-9ecf9dd06f68?q=80&w=2070&auto=format&fit=crop",
  commercialName: "Ambulancias VidaRápida",
  shortDescription: "Servicio de ambulancia 24/7. Unidades de terapia intensiva móvil y traslados programados.",
  address: "Av. 12 de Octubre N27-30 y Orellana, Quito",
  whatsappContact: "0998765432",
  emergencyPhone: "3245678",
  arrivalField: 15,
  ambulanceType: "advanced",
  coverageZone: "Quito, Valle de los Chillos y alrededores",
  availability: "24/7",
  operatingHours: {
    startTime: "00:00",
    endTime: "23:59",
  },
  interprovincialTransfers: true,
  isActive: true, // Estado del servicio: Activo
  stats: {
    profileViews: 1250,
    contactClicks: 320,
    averageRating: 4.8,
    totalReviews: 45,
  },
};

export const getAmbulanceProfileMock = (): Promise<AmbulanceProfile> => {
  return Promise.resolve(MOCK_AMBULANCE_PROFILE);
};