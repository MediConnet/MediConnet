export interface Review {
  id: string;
  patientName: string;
  rating: number; // 1 a 5
  comment: string;
  date: string; // Formato YYYY-MM-DD
}