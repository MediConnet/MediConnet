import type { ClinicDoctor, DoctorInvitation } from '../domain/doctor.entity';

export const MOCK_CLINIC_DOCTORS: ClinicDoctor[] = [
  // Médicos de Clínica Central (clinic-1)
  {
    id: 'doctor-clinic-central-1',
    clinicId: 'clinic-1',
    userId: 'user-doctor-cc-1',
    email: 'dr.juan.perez@clinicacentral.com',
    name: 'Dr. Juan Pérez',
    specialty: 'Cardiología',
    isActive: true,
    isInvited: false,
    officeNumber: '101',
    consultationFee: 50.00, // Precio establecido por la clínica
    profileImageUrl: 'https://via.placeholder.com/100',
    phone: '0991234567',
    whatsapp: '0991234567',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
    professionalProfile: {
      bio: 'Cardiólogo con más de 15 años de experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares.',
      experience: 15,
      education: [
        {
          text: 'Universidad Central del Ecuador - Medicina',
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDQ0Pj4Kc3RyZWFtCkJUCi9GMSA0OCBUZgoxMCA3MDAgVGQKKFRpdHVsbyBkZSBNZWRpY2luYSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2MCAwMDAwMCBuIAowMDAwMDAwMTE3IDAwMDAwIG4gCjAwMDAwMDAyMjYgMDAwMDAgbiAKMDAwMDAwMDI5NSAwMDAwMCBuIAp0cmFpbGVyCjw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjM4OAolJUVPRgo=',
          fileName: 'titulo_medicina_UCE.pdf'
        },
        'Especialización en Cardiología - Hospital Metropolitano'
      ],
      certifications: [
        {
          text: 'Certificación en Ecocardiografía',
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUwPj4Kc3RyZWFtCkJUCi9GMSA0OCBUZgoxMCA3MDAgVGQKKENlcnRpZmljYWNpb24gRWNvY2FyZGlvKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxMTcgMDAwMDAgbiAKMDAwMDAwMDIyNiAwMDAwMCBuIAowMDAwMDAwMjk1IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2L1Jvb3QgMSAwIFI+PgpzdGFydHhyZWYKMzk0CiUlRU9GCg==',
          fileName: 'certificado_ecocardiografia.pdf'
        },
        'Certificación en Cardiología Intervencionista'
      ],
    },
  },
  {
    id: 'doctor-clinic-central-2',
    clinicId: 'clinic-1',
    userId: 'user-doctor-cc-2',
    email: 'dra.maria.garcia@clinicacentral.com',
    name: 'Dra. María García',
    specialty: 'Pediatría',
    isActive: true,
    isInvited: false,
    officeNumber: '102',
    consultationFee: 45.00, // Precio establecido por la clínica
    profileImageUrl: 'https://via.placeholder.com/100',
    phone: '0992345678',
    whatsapp: '0992345678',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date().toISOString(),
    professionalProfile: {
      bio: 'Pediatra especializada en el cuidado integral de niños desde recién nacidos hasta adolescentes.',
      experience: 10,
      education: [
        'Universidad San Francisco de Quito',
        {
          text: 'Especialización en Pediatría - Hospital de Niños Baca Ortiz',
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDQ4Pj4Kc3RyZWFtCkJUCi9GMSA0OCBUZgoxMCA3MDAgVGQKKEVzcGVjaWFsaXphY2lvbiBQZWRpYXRyaWEpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExNyAwMDAwMCBuIAowMDAwMDAwMjI2IDAwMDAwIG4gCjAwMDAwMDAyOTUgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozOTIKJSVFT0YK',
          fileName: 'especializacion_pediatria.pdf'
        }
      ],
      certifications: [
        'Certificación en Neonatología',
        {
          text: 'Certificación en Lactancia Materna',
          fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUyPj4Kc3RyZWFtCkJUCi9GMSA0OCBUZgoxMCA3MDAgVGQKKENlcnRpZmljYWNpb24gTGFjdGFuY2lhIE1hdGVybmEpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDExNyAwMDAwMCBuIAowMDAwMDAwMjI2IDAwMDAwIG4gCjAwMDAwMDAyOTUgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozOTYKJSVFT0YK',
          fileName: 'certificado_lactancia.pdf'
        }
      ],
    },
  },
  // Médico invitado pendiente
  {
    id: 'doctor-clinic-central-3',
    clinicId: 'clinic-1',
    userId: 'user-doctor-cc-3',
    email: 'dr.carlos.rodriguez@gmail.com',
    name: 'Dr. Carlos Rodríguez',
    specialty: 'Medicina General',
    isActive: false,
    isInvited: true,
    invitationToken: 'token-clinic-central-123',
    invitationExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    consultationFee: 40.00, // Precio pre-establecido por la clínica
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

export const updateDoctorConsultationFeeMock = (
  clinicId: string, 
  doctorId: string, 
  consultationFee: number
): Promise<void> => {
  return getClinicDoctorsMock(clinicId).then((doctors) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      doctor.consultationFee = consultationFee;
      doctor.updatedAt = new Date().toISOString();
      return saveClinicDoctorsMock(clinicId, doctors);
    }
    return Promise.resolve();
  });
};
