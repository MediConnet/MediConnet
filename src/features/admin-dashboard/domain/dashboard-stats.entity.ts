export interface DashboardStats {
  totalServices: number;
  usersInApp: number;
  monthlyContacts: number;
  totalCities: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  servicesByType: {
    doctors: number;
    pharmacies: number;
    laboratories: number;
    ambulances: number;
    supplies: number;
  };
}