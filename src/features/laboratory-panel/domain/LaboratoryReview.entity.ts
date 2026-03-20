export interface LaboratoryReview {
  id: string;
  patientName: string;
  rating: number;
  comment: string | null;
  date: string;
  profilePictureUrl: string | null;
  branchName: string | null;
}
