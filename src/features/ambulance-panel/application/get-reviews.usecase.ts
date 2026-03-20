import type { Review } from "../domain/review.entity";
import { getAmbulanceReviewsAPI } from "../infrastructure/ambulance-reviews.api";

// Normaliza un item del backend al formato Review del frontend
const normalize = (r: any): Review => ({
  id: r.id,
  rating: r.rating ?? 0,
  comment: r.comment ?? "",
  patientName: r.patientName ?? r.patient?.fullName ?? r.userName ?? "Paciente",
  date: r.date ?? r.createdAt ?? new Date().toISOString(),
});

export const getAmbulanceReviewsUseCase = async (): Promise<Review[]> => {
  const data: unknown = await getAmbulanceReviewsAPI();

  if (Array.isArray(data)) return data.map(normalize);
  if (data && typeof data === "object") {
    const maybe = data as any;
    if (Array.isArray(maybe.reviews)) return maybe.reviews.map(normalize);
    if (Array.isArray(maybe.data)) return maybe.data.map(normalize);
  }

  return [];
};