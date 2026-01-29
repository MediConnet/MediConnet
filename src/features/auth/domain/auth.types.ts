// NOTE: Tipos relacionados con autenticación

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  // Note: 'confirmPassword' se maneja solo en la UI para validación
}

export interface AuthResponse {
  user: {
    id: string;       // ID interno (UUID)
    userId: string;   // Alias de id (por compatibilidad)
    email: string;
    name: string;
    role: string;     // 'admin', 'provider', 'patient'
    tipo?: string;    // 'doctor', 'pharmacy', etc. (Para guards)
    serviceType?: string; // Alias de tipo (Para redirección)
    provider?: {      // Información extra si es proveedor
      id: string;
      commercialName: string;
      logoUrl?: string | null;
    };
  };
  token: string;
  accessToken: string;
  refreshToken?: string;
}