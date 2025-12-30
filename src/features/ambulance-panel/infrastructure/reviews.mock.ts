import type { Review } from "../domain/review.entity";

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    patientName: "María García",
    rating: 5,
    comment: "Llegaron muy rápido en una emergencia. Excelente servicio, me sentí muy segura durante el traslado.",
    date: "2024-01-20",
  },
  {
    id: "r2",
    patientName: "Carlos Ruiz",
    rating: 5,
    comment: "El personal fue increíblemente amable y profesional cuidando a mi padre. La unidad estaba impecable.",
    date: "2024-01-15",
  },
  {
    id: "r3",
    patientName: "Ana Martínez",
    rating: 4,
    comment: "Servicio puntual para el traslado programado a diálisis. Muy recomendados.",
    date: "2024-01-10",
  },
  {
    id: "r4",
    patientName: "Pedro Méndez",
    rating: 5,
    comment: "Gracias por la rápida respuesta. Los paramédicos estaban muy bien preparados.",
    date: "2023-12-28",
  },
];

export const getAmbulanceReviewsMock = (): Promise<Review[]> => {
  return Promise.resolve(MOCK_REVIEWS);
};