// Definimos la forma que tendrán nuestros contadores
export interface ServiceStats {
  doctorCount: number;
  pharmacyCount: number;
  laboratoryCount: number;
  ambulanceCount: number;
  suppliesCount: number;
  lastUpdated?: Date;
}

export interface ActiveService {
  id: string;
  name: string;
  location: string;
  type: "ambulance" | "doctor" | "pharmacy" | "laboratory" | "supplies";
}