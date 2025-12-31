export interface PharmacyStats {
  profileViews: number;
  contactClicks: number;
  totalReviews: number;
  averageRating: number;
}

export interface ScheduleConfig {
  daysSummary: string; 
  hoursSummary: string; 
}

export interface PharmacyProfile {
  id: string;
  commercialName: string;
  bannerUrl: string; 
  phone: string;
  whatsappContact: string; 
  address: string;
  hasDelivery: boolean; 
  schedule: ScheduleConfig;
  stats: PharmacyStats;
}