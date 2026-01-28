export interface ProfessionalRequest {
    type: "doctor" | "pharmacy" | "lab" | "ambulance" | "supplies" | "clinic";
    name: string;
    email: string;
    password: string;
    phone: string;
    whatsapp: string;
    serviceName: string;
    address: string;
    city: string;
    price: string;
    description: string;
    chainId?: string; // Solo para farmacias
  }
  