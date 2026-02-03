import type { Review } from "../domain/review.entity";

// Función para obtener fechas recientes
const getRecentDate = (daysAgo: number) => {
  const today = new Date();
  today.setDate(today.getDate() - daysAgo);
  return today.toISOString().split("T")[0];
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    patientName: "María García",
    rating: 5,
    comment: "Llegaron muy rápido en una emergencia. Excelente servicio, me sentí muy segura durante el traslado.",
    date: getRecentDate(3),
  },
  {
    id: "r2",
    patientName: "Carlos Ruiz",
    rating: 5,
    comment: "El personal fue increíblemente amable y profesional cuidando a mi padre. La unidad estaba impecable.",
    date: getRecentDate(7),
  },
  {
    id: "r3",
    patientName: "Ana Martínez",
    rating: 4,
    comment: "Servicio puntual para el traslado programado a diálisis. Muy recomendados.",
    date: getRecentDate(10),
  },
  {
    id: "r4",
    patientName: "Pedro Méndez",
    rating: 5,
    comment: "Gracias por la rápida respuesta. Los paramédicos estaban muy bien preparados.",
    date: getRecentDate(15),
  },
  {
    id: "r5",
    patientName: "Laura Sánchez",
    rating: 5,
    comment: "Servicio excepcional. Llegaron en menos de 10 minutos y el equipo médico fue muy profesional.",
    date: getRecentDate(18),
  },
  {
    id: "r6",
    patientName: "Roberto Fernández",
    rating: 4,
    comment: "Buen servicio, aunque el tiempo de llegada fue un poco más largo de lo esperado.",
    date: getRecentDate(22),
  },
  {
    id: "r7",
    patientName: "Carmen Torres",
    rating: 5,
    comment: "Excelente atención. La ambulancia estaba muy limpia y el personal muy capacitado.",
    date: getRecentDate(25),
  },
  {
    id: "r8",
    patientName: "Diego Morales",
    rating: 5,
    comment: "Muy satisfecho con el servicio. Recomendado 100%.",
    date: getRecentDate(30),
  },
];

export const getAmbulanceReviewsMock = (): Promise<Review[]> => {
  return Promise.resolve(MOCK_REVIEWS);
};