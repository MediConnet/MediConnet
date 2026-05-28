import type { PaginatedResponse } from "../../../shared/types/pagination";
import type { Review } from "../domain/review.entity";
import { getAmbulanceReviewsAPI } from "../infrastructure/ambulance-reviews.api";

const normalize = (r: any): Review => ({
  id: r.id,
  rating: r.rating ?? 0,
  comment: r.comment ?? "",
  patientName: r.patientName ?? r.patient?.fullName ?? r.userName ?? "Paciente",
  date: r.date ?? r.createdAt ?? new Date().toISOString(),
});

export const getAmbulanceReviewsUseCase = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Review>> => {
  const result = await getAmbulanceReviewsAPI(params);
  return {
    data: result.data.map(normalize),
    pagination: result.pagination,
  };
};