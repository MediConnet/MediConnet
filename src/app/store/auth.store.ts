// TODO: Implementar store de autenticación con Zustand
// NOTE: Por ahora es una implementación temporal simple

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  tipo?: string | null; // Tipo de profesional: 'doctor', 'pharmacy', 'lab', 'ambulance', 'supplies'
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

let authState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => {
    authState.user = user;
    authState.token = token;
    authState.isAuthenticated = true;
    // Guardar token en múltiples lugares para compatibilidad
    localStorage.setItem('auth-token', token);
    localStorage.setItem('accessToken', token); // Recomendado por el backend
    localStorage.setItem('token', token); // Por compatibilidad adicional
    localStorage.setItem('auth-user', JSON.stringify(user));
  },
  logout: () => {
    authState.user = null;
    authState.token = null;
    authState.isAuthenticated = false;
    // Limpiar todos los tokens de localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');
    localStorage.removeItem('auth-user');
  },
  updateUser: (userData) => {
    if (authState.user) {
      authState.user = { ...authState.user, ...userData };
      localStorage.setItem('auth-user', JSON.stringify(authState.user));
    }
  },
};

// NOTE: Cargar estado desde localStorage al iniciar
// Buscar token en múltiples lugares (prioridad: accessToken > auth-token > token)
try {
  const savedToken = 
    localStorage.getItem('accessToken') || 
    localStorage.getItem('auth-token') || 
    localStorage.getItem('token');
  const savedUser = localStorage.getItem('auth-user');
  if (savedToken && savedUser) {
    authState.token = savedToken;
    authState.user = JSON.parse(savedUser);
    authState.isAuthenticated = true;
    // Sincronizar todos los lugares con el token encontrado
    localStorage.setItem('auth-token', savedToken);
    localStorage.setItem('accessToken', savedToken);
    localStorage.setItem('token', savedToken);
  }
} catch (error) {
  console.error('Error loading auth state from localStorage:', error);
  // Limpiar datos corruptos
  localStorage.removeItem('auth-token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('token');
  localStorage.removeItem('auth-user');
}

// Hook temporal que simula el comportamiento de Zustand
export const useAuthStore = () => {
  return {
    getState: () => authState,
    ...authState,
  };
};