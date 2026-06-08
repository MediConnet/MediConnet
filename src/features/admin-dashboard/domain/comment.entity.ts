export interface Comment {
  id: string;
  userId: string | null;
  userType: string | null;
  userName: string | null;
  userEmail: string | null;
  subject: string;
  message: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "REJECTED";
  adminResponse: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  subject: string;
  message: string;
}

export interface UpdateStatusData {
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "REJECTED";
}

export interface RespondCommentData {
  adminResponse: string;
}
