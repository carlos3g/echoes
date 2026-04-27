import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Token } from '@/features/auth/contexts/auth.context.types';
import { AuthStorageKeys } from '@/features/auth/enums';
import { zustandSecureStateStorage } from '@/lib/zustand';
import type { User } from '@/types/entities';

interface AuthState {
  token: Token;
  refreshToken: Token;
  user: User | undefined;
  initialized: boolean;
}

interface AuthActions {
  setToken: (token: Token) => void;
  setRefreshToken: (token: Token) => void;
  setUser: (user: User | undefined) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  user: undefined,
  initialized: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialState,
      setToken: (token: Token) => set({ token }),
      setRefreshToken: (token: Token) => set({ refreshToken: token }),
      setUser: (user: User | undefined) => set({ user }),
      setInitialized: (initialized: boolean) => set({ initialized }),
      reset: () => set({ ...initialState, initialized: true }),
    }),
    {
      name: AuthStorageKeys.StorageName,
      storage: createJSONStorage(() => zustandSecureStateStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
