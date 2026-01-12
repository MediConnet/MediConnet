import type { AdRequest } from "../domain/ad-request.entity";

export const MOCK_AD_REQUESTS: AdRequest[] = [
  {
    id: "ad-1",
    providerId: "doc-1",
    providerName: "Dr. Juan Pérez",
    providerEmail: "juan.perez@example.com",
    serviceType: "doctor",
    submissionDate: "2024-01-15",
    status: "PENDING",
    hasActiveAd: false,
  },
  {
    id: "ad-2",
    providerId: "lab-1",
    providerName: "Laboratorio Central",
    providerEmail: "lab.central@example.com",
    serviceType: "laboratory",
    submissionDate: "2024-01-16",
    status: "APPROVED",
    approvedAt: "2024-01-17",
    hasActiveAd: true,
  },
  {
    id: "ad-3",
    providerId: "pharm-1",
    providerName: "Farmacia San José",
    providerEmail: "farmacia@example.com",
    serviceType: "pharmacy",
    submissionDate: "2024-01-14",
    status: "REJECTED",
    rejectedAt: "2024-01-15",
    rejectionReason: "El anuncio no cumple con las políticas de contenido.",
    hasActiveAd: false,
  },
];

