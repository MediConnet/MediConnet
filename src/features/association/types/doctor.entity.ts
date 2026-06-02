export interface ClinicDoctor {
  id: string;
  clinicId: string;
  userId: string;
  email: string;
  name: string;
  specialty: string;
  isActive: boolean;
  isInvited: boolean;
  invitationToken?: string;
  invitationExpiresAt?: string;
  officeNumber?: string;
  consultationFee?: number;
  profileImageUrl?: string;
  phone?: string;
  whatsapp?: string;
  createdAt: string;
  updatedAt?: string;
  professionalProfile?: {
    bio?: string;
    experience?: number;
    education?: Array<string | { text: string; fileUrl?: string; fileName?: string }>;
    certifications?: Array<string | { text: string; fileUrl?: string; fileName?: string }>;
  };
}

export interface DoctorInvitation {
  id: string;
  clinicId: string;
  email: string;
  invitationToken: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
}
