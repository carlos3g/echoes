import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Token } from '@/features/auth/contexts/auth.context.types';
import { AuthStorageKeys } from '@/features/auth/enums';
import { zustandSecureStateStorage } from '@/lib/zustand';

interface AuthStoreInterface {
  token: Token;
  setToken: (token: Token) => void;
  refreshToken: Token;
  setRefreshToken: (token: Token) => void;
}

export const useAuthStore = create<AuthStoreInterface>()(
  persist(
    (set) => ({
      token: null,
      setToken: (newToken: Token) => set({ token: newToken }),
      refreshToken: null,
      setRefreshToken: (newToken: Token) => set({ refreshToken: newToken }),
    }),
    {
      name: AuthStorageKeys.StorageName,
      storage: createJSONStorage(() => zustandSecureStateStorage),
    }
  )
);
