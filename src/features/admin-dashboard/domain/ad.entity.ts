export interface Ad {
  id: string;
  providerId: string;
  // Campos del banner promocional
  label: string; // Ej: "PRIMERA CITA"
  discount: string; // Ej: "20% OFF"
  description: string; // Ej: "En tu primera consulta general con profesionales verificados."
  buttonText: string; // Ej: "Canjear Ahora"
  imageUrl?: string; // Imagen de profesionales
  // Fechas
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  // Campos legacy (mantener para compatibilidad)
  title?: string; // Deprecated: usar label + discount
}

