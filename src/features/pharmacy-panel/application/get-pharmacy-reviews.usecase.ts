import type { PharmacyReview } from "../domain/pharmacy-review.entity";
import { getPharmacyReviewsAPI } from "../infrastructure/pharmacy.api";

// Normaliza un item del backend al formato PharmacyReview del frontend
const normalize = (r: any): PharmacyReview => ({
  id: r.id,
  rating: r.rating ?? 0,
  comment: r.comment ?? "",
  // El backend puede devolver userName, patient.fullName o patientName
  userName: r.userName ?? r.patient?.fullName ?? r.patientName ?? "Cliente",
  // El backend puede devolver date o createdAt
  date: r.date ?? r.createdAt ?? new Date().toISOString(),
});

export const getPharmacyReviewsUseCase = async (): Promise<PharmacyReview[]> => {
  const data: unknown = await getPharmacyReviewsAPI();

  if (Array.isArray(data)) return data.map(normalize);
  if (data && typeof data === "object") {
    const maybe = data as any;
    if (Array.isArray(maybe.reviews)) return maybe.reviews.map(normalize);
    if (Array.isArray(maybe.data)) return maybe.data.map(normalize);
  }

  return [];
};