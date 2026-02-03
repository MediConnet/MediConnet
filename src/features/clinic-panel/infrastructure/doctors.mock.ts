import type { ClinicDoctor, DoctorInvitation } from '../domain/doctor.entity';

export const MOCK_CLINIC_DOCTORS: ClinicDoctor[] = [
  {
    id: 'doctor-1',
    clinicId: 'clinic-1',
    userId: 'user-1',
    email: 'dr.perez@clinic.com',
    name: 'Dr. Juan Pérez',
    specialty: 'Cardiología',
    isActive: true,
    isInvited: false,
    officeNumber: '101',
    profileImageUrl: 'https://via.placeholder.com/100',
    phone: '0991111111',
    whatsapp: '0991111111',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doctor-2',
    clinicId: 'clinic-1',
    userId: 'user-2',
    email: 'dra.garcia@clinic.com',
    name: 'Dra. María García',
    specialty: 'Pediatría',
    isActive: true,
    isInvited: false,
    officeNumber: '102',
    profileImageUrl: 'https://via.placeholder.com/100',
    phone: '0992222222',
    whatsapp: '0992222222',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doctor-3',
    clinicId: 'clinic-1',
    userId: 'user-3',
    email: 'dr.rodriguez@clinic.com',
    name: 'Dr. Carlos Rodríguez',
    specialty: 'Medicina General',
    isActive: false,
    isInvited: true,
    invitationToken: 'token-123',
    invitationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getClinicDoctorsMock = (clinicId: string): Promise<ClinicDoctor[]> => {
  const saved = localStorage.getItem(`clinic_doctors_${clinicId}`);
  if (saved) {
    try {
      return Promise.resolve(JSON.parse(saved));
    } catch {
      // Si hay error, usar los mocks
    }
  }
  return Promise.resolve(MOCK_CLINIC_DOCTORS.filter(d => d.clinicId === clinicId));
};

export const saveClinicDoctorsMock = (clinicId: string, doctors: ClinicDoctor[]): Promise<void> => {
  localStorage.setItem(`clinic_doctors_${clinicId}`, JSON.stringify(doctors));
  return Promise.resolve();
};

export const inviteDoctorMock = (clinicId: string, email: string): Promise<DoctorInvitation> => {
  const invitation: DoctorInvitation = {
    id: `inv-${Date.now()}`,
    clinicId,
    email,
    invitationToken: `token-${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  
  // Guardar invitación
  const saved = localStorage.getItem(`clinic_invitations_${clinicId}`);
  const invitations: DoctorInvitation[] = saved ? JSON.parse(saved) : [];
  invitations.push(invitation);
  localStorage.setItem(`clinic_invitations_${clinicId}`, JSON.stringify(invitations));
  
  return Promise.resolve(invitation);
};

export const toggleDoctorStatusMock = (clinicId: string, doctorId: string): Promise<void> => {
  return getClinicDoctorsMock(clinicId).then((doctors) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      doctor.isActive = !doctor.isActive;
      doctor.updatedAt = new Date().toISOString();
      return saveClinicDoctorsMock(clinicId, doctors);
    }
    return Promise.resolve();
  });
};

export const assignOfficeMock = (clinicId: string, doctorId: string, officeNumber: string): Promise<void> => {
  return getClinicDoctorsMock(clinicId).then((doctors) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      doctor.officeNumber = officeNumber;
      doctor.updatedAt = new Date().toISOString();
      return saveClinicDoctorsMock(clinicId, doctors);
    }
    return Promise.resolve();
  });
};
