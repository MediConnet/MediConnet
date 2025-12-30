export interface AmbulanceProfile {
  id: string;
  bannerUrl: string; 
  commercialName: string; 
  shortDescription: string; 
  address: string; 
  whatsappContact: string; 
  emergencyPhone: string;
  
  // Métricas para el dashboard (KPIs)
  stats: {
    profileViews: number;
    contactClicks: number;
    averageRating: number;
    totalReviews: number;
  };
}