import { create } from 'zustand';

const AUTH_TOKEN_KEY = 'admin-token';

interface AuthState {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(AUTH_TOKEN_KEY),
  login: (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    set({ token: null });
  },
}));

export { AUTH_TOKEN_KEY };
