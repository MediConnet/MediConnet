import { httpClient, extractData } from '../../../shared/lib/http';
import type { LaboratoryDashboard } from "../domain/LaboratoryDashboard.entity";
import type { LaboratoryReview } from "../domain/LaboratoryReview.entity";

/**
 * API: Obtener dashboard de laboratorio
 * Endpoint: GET /api/laboratories/:userId/dashboard
 */
export const getLaboratoryDashboardAPI = async (userId: string): Promise<LaboratoryDashboard> => {
  const response = await httpClient.get<{ success: boolean; data: LaboratoryDashboard }>(
    `/laboratories/${userId}/dashboard`
  );
  return extractData(response);
};

/**
 * API: Obtener reseñas del panel de laboratorio (proveedor autenticado)
 * Endpoint: GET /api/laboratories/reviews
 * Requiere: Bearer token
 */
export const getLaboratoryPanelReviewsAPI = async (): Promise<{
  reviews: LaboratoryReview[];
  averageRating: number;
  totalReviews: number;
}> => {
  const response = await httpClient.get<{
    success: boolean;
    data: {
      reviews: LaboratoryReview[];
      averageRating: number;
      totalReviews: number;
    };
  }>('/laboratories/reviews');
  return extractData(response);
};

// ---------------------------------------------------------------------------
// Profile (Panel Laboratorio)
// ---------------------------------------------------------------------------

export type LaboratoryProfileScheduleDTO = {
  day_id: number;
  day: string; // monday..sunday
  start: string; // HH:mm
  end: string; // HH:mm
};

export type LaboratoryExamDTO = {
  id: string;
  name: string;
  description: string | null;
  preparation?: string | null;
  price: number;
  is_available: boolean;
  type?: string | null;
};

export type LaboratoryProfileDTO = {
  full_name: string;
  description: string;
  logo_url: string | null;
  address: string;
  phone: string | null;
  whatsapp: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  is_published: boolean;
  schedules: LaboratoryProfileScheduleDTO[];
  exams: LaboratoryExamDTO[];
};

export const getLaboratoryProfileAPI = async (): Promise<LaboratoryProfileDTO> => {
  const response = await httpClient.get<{ success: boolean; data: LaboratoryProfileDTO }>(
    "/laboratories/profile",
  );
  return extractData(response);
};

export type UpdateLaboratoryProfileBody = Partial<{
  full_name: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  latitude: number | string;
  longitude: number | string;
  google_maps_url: string;
  logo_url: string;
  is_published: boolean;
  workSchedule: Array<{
    day:
      | "monday"
      | "tuesday"
      | "wednesday"
      | "thursday"
      | "friday"
      | "saturday"
      | "sunday";
    enabled: boolean;
    startTime: string;
    endTime: string;
  }>;
}>;

export const updateLaboratoryProfileAPI = async (
  body: UpdateLaboratoryProfileBody,
): Promise<LaboratoryProfileDTO> => {
  const response = await httpClient.put<{ success: boolean; data: LaboratoryProfileDTO }>(
    "/laboratories/profile",
    body,
  );
  return extractData(response);
};

// ---------------------------------------------------------------------------
// Exams / Services (Panel Laboratorio)
// ---------------------------------------------------------------------------

export const getLaboratoryExamsAPI = async (): Promise<{ exams: LaboratoryExamDTO[] }> => {
  const response = await httpClient.get<{ success: boolean; data: { exams: LaboratoryExamDTO[] } }>(
    "/laboratories/exams",
  );
  return extractData(response);
};

export type CreateLaboratoryExamBody = {
  name: string;
  description?: string;
  preparation?: string;
  price?: number;
  is_available?: boolean;
};

export const createLaboratoryExamAPI = async (
  body: CreateLaboratoryExamBody,
): Promise<LaboratoryExamDTO> => {
  const response = await httpClient.post<{ success: boolean; data: LaboratoryExamDTO }>(
    "/laboratories/exams",
    body,
  );
  return extractData(response);
};

export type UpdateLaboratoryExamBody = Partial<CreateLaboratoryExamBody>;

export const updateLaboratoryExamAPI = async (
  examId: string,
  body: UpdateLaboratoryExamBody,
): Promise<LaboratoryExamDTO> => {
  const response = await httpClient.put<{ success: boolean; data: LaboratoryExamDTO }>(
    `/laboratories/exams/${examId}`,
    body,
  );
  return extractData(response);
};

export const deleteLaboratoryExamAPI = async (examId: string): Promise<{ id: string }> => {
  const response = await httpClient.delete<{ success: boolean; data: { id: string } }>(
    `/laboratories/exams/${examId}`,
  );
  return extractData(response);
};
