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
    localStorage.setItem('auth-token', token);
    localStorage.setItem('auth-user', JSON.stringify(user));
  },
  logout: () => {
    authState.user = null;
    authState.token = null;
    authState.isAuthenticated = false;
    localStorage.removeItem('auth-token');
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
try {
  const savedToken = localStorage.getItem('auth-token');
  const savedUser = localStorage.getItem('auth-user');
  if (savedToken && savedUser) {
    authState.token = savedToken;
    authState.user = JSON.parse(savedUser);
    authState.isAuthenticated = true;
  }
} catch (error) {
  console.error('Error loading auth state from localStorage:', error);
  // Limpiar datos corruptos
  localStorage.removeItem('auth-token');
  localStorage.removeItem('auth-user');
}

// Hook temporal que simula el comportamiento de Zustand
export const useAuthStore = () => {
  return {
    getState: () => authState,
    ...authState,
  };
};