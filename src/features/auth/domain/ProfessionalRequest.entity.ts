export interface ProfessionalRequest {
    type: "doctor" | "pharmacy" | "lab" | "ambulance" | "supplies";
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    serviceName: string;
    address: string;
    city: string;
    price: string;
    description: string;
  }
  