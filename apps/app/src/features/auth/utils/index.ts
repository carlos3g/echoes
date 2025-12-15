import { useAuthStore } from '@/features/auth/store/auth.store';

export const signOut = () => {
  useAuthStore.getState().setToken(null);
  useAuthStore.getState().setRefreshToken(null);
};
