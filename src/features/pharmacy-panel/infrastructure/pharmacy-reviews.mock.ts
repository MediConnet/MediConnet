import type { PharmacyReview } from "../domain/pharmacy-review.entity";

export const MOCK_PHARMACY_REVIEWS: PharmacyReview[] = [
  {
    id: "r1",
    userName: "Carla Méndez",
    rating: 5,
    comment: "Excelente servicio a domicilio. Los medicamentos llegaron sellados y en menos de 30 minutos.",
    date: "2024-02-10",
  },
  {
    id: "r2",
    userName: "Luis Gómez",
    rating: 4,
    comment: "Tienen buen stock de medicinas que no encontré en otras farmacias, aunque la fila estaba un poco larga.",
    date: "2024-02-05",
  },
  {
    id: "r3",
    userName: "Andrea Torres",
    rating: 5,
    comment: "El farmacéutico fue muy amable y me explicó bien cómo tomar el tratamiento. Precios justos.",
    date: "2024-01-28",
  },
  {
    id: "r4",
    userName: "Fernando Ruiz",
    rating: 3,
    comment: "El pedido llegó bien, pero el motorizado no tenía cambio. Por lo demás todo ok.",
    date: "2024-01-15",
  },
];

export const getPharmacyReviewsMock = (): Promise<PharmacyReview[]> => {
  return Promise.resolve(MOCK_PHARMACY_REVIEWS);
};