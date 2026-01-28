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
  officeNumber?: string; // Consultorio asignado (opcional)
  profileImageUrl?: string;
  phone?: string;
  whatsapp?: string;
  createdAt: string;
  updatedAt?: string;
  // Perfil profesional del médico (solo editable por el médico)
  professionalProfile?: {
    bio?: string;
    experience?: number;
    education?: string[];
    certifications?: string[];
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
