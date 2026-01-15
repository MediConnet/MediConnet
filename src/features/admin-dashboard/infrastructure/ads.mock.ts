import type { Ad } from "../domain/ad.entity";

// Función para obtener fechas futuras
const getFutureDate = (daysFromToday: number) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysFromToday);
  return futureDate.toISOString().split("T")[0];
};

export const MOCK_ADS: Ad[] = [
  {
    id: "ad-1",
    providerId: "doc-1",
    providerName: "Dr. Juan Pérez",
    providerType: "doctor",
    title: "Consulta Médica Especializada - Descuento del 20%",
    description: "Aprovecha nuestro descuento especial del 20% en consultas médicas durante todo el mes. Atención de calidad con especialistas certificados.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    status: "active",
    startDate: getFutureDate(0),
    endDate: getFutureDate(30),
    createdAt: getFutureDate(-5),
  },
  {
    id: "ad-2",
    providerId: "lab-1",
    providerName: "Laboratorio Clínico Vital",
    providerType: "laboratory",
    title: "Exámenes de Laboratorio con Resultados Rápidos",
    description: "Realiza tus exámenes de laboratorio con nosotros. Resultados en 24 horas. Equipos de última generación.",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800",
    status: "active",
    startDate: getFutureDate(-3),
    endDate: getFutureDate(60),
    createdAt: getFutureDate(-10),
  },
  {
    id: "ad-3",
    providerId: "pharm-1",
    providerName: "Farmacia Fybeca",
    providerType: "pharmacy",
    title: "Descuento 20% en Medicamentos Genéricos",
    description: "Aprovecha nuestro descuento especial en toda la línea de medicamentos genéricos. Válido hasta fin de mes.",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
    status: "active",
    startDate: getFutureDate(0),
    endDate: getFutureDate(30),
    createdAt: getFutureDate(-2),
  },
  {
    id: "ad-4",
    providerId: "amb-1",
    providerName: "Ambulancias Rápidas",
    providerType: "ambulance",
    title: "Servicio de Ambulancia 24/7",
    description: "Servicio de emergencia disponible las 24 horas del día. Respuesta inmediata en toda la ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
    status: "active",
    startDate: getFutureDate(-7),
    endDate: getFutureDate(60),
    createdAt: getFutureDate(-15),
  },
  {
    id: "ad-5",
    providerId: "doc-2",
    providerName: "Dr. María González",
    providerType: "doctor",
    title: "Chequeo Cardiológico Completo",
    description: "Paquete completo de estudios cardiológicos con descuento del 15%. Incluye electrocardiograma y ecocardiograma.",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    status: "active",
    startDate: getFutureDate(5),
    endDate: getFutureDate(45),
    createdAt: getFutureDate(-1),
  },
  {
    id: "ad-6",
    providerId: "supplies-1",
    providerName: "Insumos Médicos Plus",
    providerType: "supplies",
    title: "Equipos Médicos de Alta Calidad",
    description: "Distribuidora de insumos y equipo médico. Vendemos al mayoreo y menudeo. Guantes, jeringas, material de curación.",
    imageUrl: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800",
    status: "active",
    startDate: getFutureDate(2),
    endDate: getFutureDate(50),
    createdAt: getFutureDate(-3),
  },
];

// Guardar en localStorage
export const saveAdsToStorage = (ads: Ad[]) => {
  localStorage.setItem("ads", JSON.stringify(ads));
};

// Cargar de localStorage
export const loadAdsFromStorage = (): Ad[] => {
  try {
    const saved = localStorage.getItem("ads");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

