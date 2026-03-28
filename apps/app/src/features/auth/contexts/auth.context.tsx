import type React from 'react';
import { createContext, useCallback, useEffect, useMemo } from 'react';
import type { AuthContextValue } from '@/features/auth/contexts/auth.context.types';
import type { SignInOutput } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { httpClientService } from '@/shared/services';
import type { ApiResponse, ApiResponseError } from '@/types/api';
import { signOut } from '@/features/auth/utils';
import { api } from '@/lib/axios';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

httpClientService.registerResponseInterceptor<ApiResponse, ApiResponseError>(undefined, async (error) => {
  const statusCode = error.response?.status;
  const message = error.response?.data?.message;

  if (statusCode !== 401) {
    throw error;
  }

  if (message?.includes('Invalid credentials')) {
    throw error;
  }

  const { refreshToken: storedRefreshToken } = useAuthStore.getState();

  if (!storedRefreshToken) {
    signOut();
    throw error;
  }

  if (isRefreshing) {
    return new Promise<string>((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then((token) => {
      if (error.config) {
        error.config.headers.Authorization = `Bearer ${token}`;
        return api.request(error.config);
      }
    });
  }

  isRefreshing = true;

  try {
    const response = await authService.refreshToken({ refreshToken: storedRefreshToken });
    const { setToken, setRefreshToken } = useAuthStore.getState();

    setToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    httpClientService.bearerToken = response.accessToken;

    processQueue(null, response.accessToken);

    if (error.config) {
      error.config.headers.Authorization = `Bearer ${response.accessToken}`;
      return api.request(error.config);
    }
  } catch (refreshError) {
    processQueue(refreshError, null);
    signOut();
    throw refreshError;
  } finally {
    isRefreshing = false;
  }
});

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token, refreshToken, setToken, setRefreshToken, user, setUser, initialized, setInitialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      initialize();
    });

    if (useAuthStore.persist.hasHydrated()) {
      initialize();
    }

    return unsubscribe;
  }, []);

  const initialize = useCallback(async () => {
    const currentToken = useAuthStore.getState().token;
    httpClientService.bearerToken = currentToken || '';

    if (currentToken) {
      try {
        const response = await authService.me();
        useAuthStore.getState().setUser(response?.user);
      } catch {
        signOut();
        return;
      }
    }

    useAuthStore.getState().setInitialized(true);
  }, []);

  const updateUser = useCallback(async () => {
    const response = await authService.me();
    setUser(response?.user);
  }, [setUser]);

  const handleSignIn = useCallback(
    (apiResponse: SignInOutput) => {
      setUser(apiResponse.user);
      setToken(apiResponse.accessToken);
      setRefreshToken(apiResponse.refreshToken);
      httpClientService.bearerToken = apiResponse.accessToken;
    },
    [setToken, setUser, setRefreshToken]
  );

  const value = useMemo(
    () => ({ token, user, handleSignIn, handleSignOut: signOut, updateUser, refreshToken, isAuth: !!token }),
    [token, user, handleSignIn, updateUser, refreshToken]
  );

  if (!initialized) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
