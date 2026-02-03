import type { PharmacyReview } from "../domain/pharmacy-review.entity";

// Función para obtener fechas recientes
const getRecentDate = (daysAgo: number) => {
  const today = new Date();
  today.setDate(today.getDate() - daysAgo);
  return today.toISOString().split("T")[0];
};

export const MOCK_PHARMACY_REVIEWS: PharmacyReview[] = [
  {
    id: "r1",
    userName: "Carla Méndez",
    rating: 5,
    comment: "Excelente servicio a domicilio. Los medicamentos llegaron sellados y en menos de 30 minutos.",
    date: getRecentDate(2),
  },
  {
    id: "r2",
    userName: "Luis Gómez",
    rating: 4,
    comment: "Tienen buen stock de medicinas que no encontré en otras farmacias, aunque la fila estaba un poco larga.",
    date: getRecentDate(5),
  },
  {
    id: "r3",
    userName: "Andrea Torres",
    rating: 5,
    comment: "El farmacéutico fue muy amable y me explicó bien cómo tomar el tratamiento. Precios justos.",
    date: getRecentDate(8),
  },
  {
    id: "r4",
    userName: "Fernando Ruiz",
    rating: 3,
    comment: "El pedido llegó bien, pero el motorizado no tenía cambio. Por lo demás todo ok.",
    date: getRecentDate(12),
  },
  {
    id: "r5",
    userName: "María González",
    rating: 5,
    comment: "Siempre encuentro lo que necesito. El personal es muy profesional y atento.",
    date: getRecentDate(15),
  },
  {
    id: "r6",
    userName: "Juan Pérez",
    rating: 4,
    comment: "Buen servicio, precios competitivos. La única queja es que a veces hay mucha gente.",
    date: getRecentDate(18),
  },
  {
    id: "r7",
    userName: "Sofía Ramírez",
    rating: 5,
    comment: "Me encanta que tengan servicio 24 horas. Muy útil para emergencias nocturnas.",
    date: getRecentDate(20),
  },
  {
    id: "r8",
    userName: "Carlos Rodríguez",
    rating: 4,
    comment: "Buena atención y productos de calidad. Recomendado.",
    date: getRecentDate(25),
  },
];

export const getPharmacyReviewsMock = (): Promise<PharmacyReview[]> => {
  return Promise.resolve(MOCK_PHARMACY_REVIEWS);
};