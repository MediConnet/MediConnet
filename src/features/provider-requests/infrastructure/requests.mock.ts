import type { ProviderRequest } from "../domain/provider-request.entity";

export const MOCK_REQUESTS: ProviderRequest[] = [
  {
    id: 'REQ-001',
    providerName: 'Dr. Roberto Sánchez',
    email: 'roberto.sanchez@email.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=11', // Avatar de ejemplo
    serviceType: 'doctor',
    submissionDate: '2024-01-25',
    documentsCount: 3,
    status: 'PENDING'
  },
  {
    id: 'REQ-002',
    providerName: 'Farmacia Santa Martha',
    email: 'contacto@santamartha.com',
    serviceType: 'pharmacy',
    submissionDate: '2024-01-24',
    documentsCount: 5,
    status: 'APPROVED'
  },
  {
    id: 'REQ-003',
    providerName: 'Laboratorio Clínico Vital',
    email: 'info@labvital.ec',
    serviceType: 'laboratory',
    submissionDate: '2024-01-23',
    documentsCount: 4,
    status: 'REJECTED'
  },
  {
    id: 'REQ-004',
    providerName: 'Dra. Laura Mendoza',
    email: 'laura.mendoza@email.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    serviceType: 'doctor',
    submissionDate: '2024-01-22',
    documentsCount: 3,
    status: 'PENDING'
  },
  {
    id: 'REQ-005',
    providerName: 'Ambulancias Rápidas 24/7',
    email: 'gerencia@ambulanciasrapidas.com',
    serviceType: 'ambulance',
    submissionDate: '2024-01-20',
    documentsCount: 2,
    status: 'APPROVED'
  },
];