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
    label: "PRIMERA CITA",
    discount: "20% OFF",
    description: "En tu primera consulta general con profesionales verificados.",
    buttonText: "Canjear Ahora",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    status: "active",
    startDate: getFutureDate(0),
    endDate: getFutureDate(30),
    createdAt: getFutureDate(-5),
    // Legacy fields
    title: "Consulta Médica Especializada - Descuento del 20%",
  },
  {
    id: "ad-2",
    providerId: "lab-1",
    label: "EXÁMENES",
    discount: "15% OFF",
    description: "Realiza tus exámenes de laboratorio con nosotros. Resultados en 24 horas.",
    buttonText: "Reservar",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800",
    status: "active",
    startDate: getFutureDate(-3),
    endDate: getFutureDate(60),
    createdAt: getFutureDate(-10),
    title: "Exámenes de Laboratorio con Resultados Rápidos",
  },
  {
    id: "ad-3",
    providerId: "pharm-1",
    label: "MEDICAMENTOS",
    discount: "20% OFF",
    description: "Aprovecha nuestro descuento especial en toda la línea de medicamentos genéricos.",
    buttonText: "Ver Ofertas",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
    status: "active",
    startDate: getFutureDate(0),
    endDate: getFutureDate(30),
    createdAt: getFutureDate(-2),
    title: "Descuento 20% en Medicamentos Genéricos",
  },
  {
    id: "ad-4",
    providerId: "amb-1",
    label: "EMERGENCIA",
    discount: "24/7",
    description: "Servicio de emergencia disponible las 24 horas del día. Respuesta inmediata.",
    buttonText: "Llamar Ahora",
    imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800",
    status: "active",
    startDate: getFutureDate(-7),
    endDate: getFutureDate(60),
    createdAt: getFutureDate(-15),
    title: "Servicio de Ambulancia 24/7",
  },
  {
    id: "ad-5",
    providerId: "doc-2",
    label: "CHEQUEO",
    discount: "15% OFF",
    description: "Paquete completo de estudios cardiológicos. Incluye electrocardiograma y ecocardiograma.",
    buttonText: "Agendar",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    status: "active",
    startDate: getFutureDate(5),
    endDate: getFutureDate(45),
    createdAt: getFutureDate(-1),
    title: "Chequeo Cardiológico Completo",
  },
  {
    id: "ad-6",
    providerId: "supplies-1",
    label: "INSUMOS",
    discount: "10% OFF",
    description: "Distribuidora de insumos y equipo médico. Vendemos al mayoreo y menudeo.",
    buttonText: "Ver Catálogo",
    imageUrl: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800",
    status: "active",
    startDate: getFutureDate(2),
    endDate: getFutureDate(50),
    createdAt: getFutureDate(-3),
    title: "Equipos Médicos de Alta Calidad",
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

// Limpiar todos los anuncios del localStorage
export const clearAdsFromStorage = (): void => {
  localStorage.removeItem("ads");
  localStorage.removeItem("ad-requests");
};

