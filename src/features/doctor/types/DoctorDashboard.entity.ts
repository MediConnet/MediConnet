export interface WorkSchedule {
  day: string;
  day_id?: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string | null;
  breakEnd?: string | null;
  timeSlots?: TimeSlot[];
  blockedHours?: string[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export type PaymentMethod = 'card' | 'cash' | 'both';
export type ProfileStatus = 'draft' | 'published' | 'suspended';

export interface DoctorDashboard {
  visits: number;
  contacts: number;
  reviews: number;
  rating: number;
  doctor: {
    id?: string;
    name: string;
    specialty: string | string[];
    specialties?: Array<{ id: string; name: string }>;
    email: string;
    whatsapp: string;
    address: string;
    latitude?: number | null;
    longitude?: number | null;
    google_maps_url?: string | null;
    price: number;
    description: string;
    experience?: number;
    workSchedule?: WorkSchedule[];
    isActive?: boolean;
    profileStatus?: ProfileStatus;
    paymentMethods?: PaymentMethod;
    consultationDuration?: number;
    imageUrl?: string | null;
    profile_picture_url?: string | null;
    preview_images?: string[];
  };
  clinic?: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    logoUrl?: string;
  } | null;
}
