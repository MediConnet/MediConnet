export interface ActivityItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error'; 
  message: string;
  timestamp: string;
}

export interface DashboardStats {
  totalServices: { value: number; trend: string }; 
  usersInApp: { value: number; trend: string };
  monthlyContacts: number;
  totalCities: number;
  requestStatus: {
    pending: number;
    approved: number;
    rejected: number;
  };
  servicesByType: {
    doctors: number;
    pharmacies: number;
    laboratories: number;
    ambulances: number;
    supplies: number;
  };
  recentActivity: ActivityItem[];
}