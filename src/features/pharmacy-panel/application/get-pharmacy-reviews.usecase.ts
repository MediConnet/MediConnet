import type { PaginatedResponse } from "../../../shared/types/pagination";
import type { PharmacyReview } from "../domain/pharmacy-review.entity";
import { getPharmacyReviewsAPI } from "../infrastructure/pharmacy.api";

const normalize = (r: any): PharmacyReview => ({
  id: r.id,
  rating: r.rating ?? 0,
  comment: r.comment ?? "",
  userName: r.userName ?? r.patient?.fullName ?? r.patientName ?? "Cliente",
  date: r.date ?? r.createdAt ?? new Date().toISOString(),
});

export const getPharmacyReviewsUseCase = async (
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<PharmacyReview>> => {
  const result = await getPharmacyReviewsAPI(params);
  return {
    data: result.data.map(normalize),
    pagination: result.pagination,
  };
};