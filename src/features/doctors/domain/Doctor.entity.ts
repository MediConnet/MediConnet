/**
 * Entidad Doctor
 */
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  rating: number;
  totalReviews: number;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  bio?: string;
  education?: string[];
  experience?: string[];
  languages?: string[];

  photoUrl?: string;         
  registrationNumber?: string; 
  scheduleText?: string;     
  consultationFee?: number;
}





