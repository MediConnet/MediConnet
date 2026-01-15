import type { AmbulanceAd } from "../domain/ambulance-ad.entity";

// Función para obtener fechas futuras
const getFutureDate = (daysFromToday: number) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysFromToday);
  return futureDate.toISOString().split("T")[0];
};

// Mocks completos de anuncios de ambulancia
export const MOCK_AMBULANCE_ADS: AmbulanceAd[] = [
  {
    id: "amb-ad-1",
    title: "Servicio de Ambulancia 24/7",
    description: "Servicio de emergencia disponible las 24 horas del día, los 7 días de la semana. Respuesta inmediata en toda la ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
    status: "active",
    startDate: getFutureDate(0),
    endDate: getFutureDate(60),
  },
  {
    id: "amb-ad-2",
    title: "Ambulancia con Equipo de UCI",
    description: "Ambulancias equipadas con unidad de cuidados intensivos móvil. Personal médico especializado disponible.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    status: "active",
    startDate: getFutureDate(-3),
    endDate: getFutureDate(90),
  },
  {
    id: "amb-ad-3",
    title: "Traslados Interhospitalarios",
    description: "Servicio especializado en traslados entre hospitales. Equipo médico completo y monitoreo constante.",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    status: "active",
    startDate: getFutureDate(5),
    endDate: getFutureDate(45),
  },
  {
    id: "amb-ad-4",
    title: "Ambulancia Pediátrica Especializada",
    description: "Unidades especialmente equipadas para atención pediátrica. Personal capacitado en emergencias infantiles.",
    imageUrl: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800",
    status: "draft",
    startDate: getFutureDate(15),
    endDate: getFutureDate(75),
  },
  {
    id: "amb-ad-5",
    title: "Servicio de Ambulancia para Eventos",
    description: "Cobertura médica para eventos, conciertos y actividades masivas. Prevención y respuesta inmediata.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
    status: "active",
    startDate: getFutureDate(-7),
    endDate: getFutureDate(30),
  },
];

export const getAmbulanceAdsMock = (): Promise<AmbulanceAd[]> => {
  return Promise.resolve(MOCK_AMBULANCE_ADS);
};