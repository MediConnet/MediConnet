// NOTE: Tipos relacionados con autenticación
// TODO: Agregar más tipos según sea necesario

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  // Note: 'confirmPassword' se maneja solo en la UI para validación, no se envía al backend.
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}




