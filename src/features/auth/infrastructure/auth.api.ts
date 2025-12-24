import { type AuthResponse, type LoginCredentials, type RegisterCredentials } from '../domain/auth.types';

// Simulación de delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * API: Iniciar sesión (Simulado)
 */
export const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(1000);
  // Simulación exitosa
  return {
    user: {
      id: 'user-123',
      email: credentials.email,
      name: 'Usuario de Prueba',
      role: 'patient',
    },
    token: 'mock-jwt-token-login',
  };
};

/**
 * API: Registrar nuevo usuario (Simulado)
 * ✅ NUEVA FUNCIÓN
 */
export const registerAPI = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    await delay(0); 
    
    // Aquí el backend validaría si el email ya existe, etc.
    // Simulamos un registro exitoso que devuelve el usuario creado y su token.
    return {
        user: {
            id: `new-user-${Date.now()}`,
            email: credentials.email,
            name: credentials.name,
            role: 'patient',
        },
        token: 'mock-jwt-token-register',
    };
};