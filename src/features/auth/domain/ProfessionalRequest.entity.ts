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
  
  // Opcionales según el tipo
  chainId?: string; // Solo para farmacias
  specialty?: string; // Solo para doctores
  
  // Archivos (Se envían al backend para subir a S3/Local)
  files?: {
    licenses: File[];
    certificates: File[];
    titles: File[];
  };
}