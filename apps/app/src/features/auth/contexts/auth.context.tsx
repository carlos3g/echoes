import type React from 'react';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthContextValue } from '@/features/auth/contexts/auth.context.types';
import type { SignInOutput } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { httpClientService } from '@/shared/services';
import type { User } from '@/types/entities';
import type { ApiResponse, ApiResponseError } from '@/types/api';
import { signOut } from '@/features/auth/utils';

httpClientService.registerResponseInterceptor<ApiResponse, ApiResponseError>(undefined, (error) => {
  const statusCode = error.response?.status;
  const message = error.response?.data?.message;

  switch (statusCode) {
    case 401:
      if (message?.includes('Senha incorreta')) {
        throw error;
      }

      signOut();
      break;
    default:
      throw error;
  }
});

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const { refreshToken, setRefreshToken, setToken, token } = useAuthStore();

  const updateUser = useCallback(async () => {
    const response = await authService.me();
    setUser(response?.user);
  }, [setUser]);

  useEffect(() => {
    const loadToken = async () => {
      httpClientService.bearerToken = token || '';

      if (token) {
        await updateUser();
      }

      setInitialized(true);
    };

    void loadToken();
  }, [token, updateUser]);

  const handleSignIn = useCallback(
    (apiResponse: SignInOutput) => {
      setUser(apiResponse.user);
      setToken(apiResponse.accessToken);
      setRefreshToken(apiResponse.refreshToken);
      httpClientService.bearerToken = apiResponse.accessToken;
    },
    [setToken, setUser, setRefreshToken]
  );

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  const value = useMemo(
    () => ({ token, user, handleSignIn, handleSignOut, updateUser, refreshToken, isAuth: !!token }),
    [token, user, handleSignIn, handleSignOut, updateUser, refreshToken]
  );

  if (!initialized) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
