// TODO: Implementar store de autenticación con Zustand
// NOTE: Por ahora es una implementación temporal simple

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// NOTE: Implementación temporal sin Zustand
// TODO: Reemplazar con Zustand cuando se configure
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
const savedToken = localStorage.getItem('auth-token');
const savedUser = localStorage.getItem('auth-user');
if (savedToken && savedUser) {
  authState.token = savedToken;
  authState.user = JSON.parse(savedUser);
  authState.isAuthenticated = true;
}

// Hook temporal que simula el comportamiento de Zustand
export const useAuthStore = () => {
  return {
    getState: () => authState,
    ...authState,
  };
};





