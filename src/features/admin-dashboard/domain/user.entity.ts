export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PROVIDER" | "PROFESIONAL" | "PATIENT" | "admin" | "provider" | "clinic" | "patient";
  tipo?: "doctor" | "pharmacy" | "lab" | "ambulance" | "supplies";
  isActive: boolean;
  createdAt?: string;
  displayName?: string;
  additionalInfo?: string;
  provider?: {
    id: string;
    commercialName: string;
    verificationStatus: string;
    serviceType: string;
  };
  clinic?: {
    id: string;
    name: string;
    phone: string;
    address: string;
  };
}

