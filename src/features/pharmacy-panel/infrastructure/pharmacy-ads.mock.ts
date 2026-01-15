import type { PharmacyAd } from "../domain/pharmacy-ad.entity";

// Función para obtener fechas futuras
const getFutureDate = (daysFromToday: number) => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysFromToday);
  return futureDate.toISOString().split("T")[0];
};

// Mocks completos de anuncios de farmacia
export const MOCK_PHARMACY_ADS: PharmacyAd[] = [
  {
    id: "pharm-ad-1",
    title: "Descuento 20% en Medicamentos Genéricos",
    description: "Aprovecha nuestro descuento especial en toda la línea de medicamentos genéricos. Válido hasta fin de mes.",
    imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800",
    status: "active",
    startDate: getFutureDate(0),
    endDate: getFutureDate(30),
  },
  {
    id: "pharm-ad-2",
    title: "Promoción: 2x1 en Vitaminas",
    description: "Compra cualquier vitamina y lleva la segunda gratis. Promoción válida en todas nuestras sucursales.",
    imageUrl: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800",
    status: "active",
    startDate: getFutureDate(-5),
    endDate: getFutureDate(15),
  },
  {
    id: "pharm-ad-3",
    title: "Nuevo Llegado: Productos de Belleza Premium",
    description: "Descubre nuestra nueva línea de productos de belleza y cuidado personal. Calidad garantizada.",
    imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800",
    status: "active",
    startDate: getFutureDate(2),
    endDate: getFutureDate(45),
  },
  {
    id: "pharm-ad-4",
    title: "Descuento Especial en Productos para Bebés",
    description: "Todo lo que necesitas para tu bebé con 15% de descuento. Pañales, leche, accesorios y más.",
    imageUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800",
    status: "draft",
    startDate: getFutureDate(10),
    endDate: getFutureDate(40),
  },
  {
    id: "pharm-ad-5",
    title: "Promoción de Verano: Protectores Solares",
    description: "Protege tu piel con nuestros protectores solares. Descuento del 25% en toda la línea.",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800",
    status: "active",
    startDate: getFutureDate(-10),
    endDate: getFutureDate(20),
  },
];

export const getPharmacyAdsMock = (): Promise<PharmacyAd[]> => {
  return Promise.resolve(MOCK_PHARMACY_ADS);
};