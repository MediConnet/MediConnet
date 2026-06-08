import { httpClient, extractData } from "../../../shared/lib/http";
import { Comment, UpdateStatusData, RespondCommentData } from "../domain/comment.entity";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getCommentsAPI = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<PaginatedResponse<Comment>> => {
  const response = await httpClient.get<{ success: boolean; data: PaginatedResponse<Comment> }>(
    "/comments",
    { params }
  );
  return extractData(response);
};

export const getCommentByIdAPI = async (id: string): Promise<Comment> => {
  const response = await httpClient.get<{ success: boolean; data: Comment }>(
    `/comments/${id}`
  );
  return extractData(response);
};

export const updateCommentStatusAPI = async (
  id: string,
  data: UpdateStatusData
): Promise<{ id: string; status: string }> => {
  const response = await httpClient.patch(`/comments/${id}/status`, data);
  return extractData(response);
};

export const respondToCommentAPI = async (
  id: string,
  data: RespondCommentData
): Promise<{ id: string; status: string; adminResponse: string }> => {
  const response = await httpClient.patch(`/comments/${id}/response`, data);
  return extractData(response);
};

export const deleteCommentAPI = async (id: string): Promise<void> => {
  await httpClient.delete(`/comments/${id}`);
};
