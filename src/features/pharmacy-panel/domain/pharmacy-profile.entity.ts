export interface PharmacyStats {
  profileViews: number;
  contactClicks: number;
  totalReviews: number;
  averageRating: number;
}
export interface PharmacyProfile {
  id: string;
  commercialName: string;
  logoUrl: string;      
  ruc: string;          
  description: string;  
  websiteUrl: string;   
  stats: PharmacyStats; 
}