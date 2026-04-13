export interface PharmacyBranch {
  id: string;
  name: string; 
  address: string; 
  openingHours: string; 
  phone: string;
  whatsapp: string;
  hasHomeDelivery: boolean; 
  isActive: boolean;
  latitude?: number | null;
  longitude?: number | null;
  google_maps_url?: string | null;
}