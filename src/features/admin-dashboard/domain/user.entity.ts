export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PROVIDER" | "PROFESIONAL" | "PATIENT";
  tipo?: "doctor" | "pharmacy" | "lab" | "ambulance" | "supplies";
  isActive: boolean;
  createdAt: string;
}

