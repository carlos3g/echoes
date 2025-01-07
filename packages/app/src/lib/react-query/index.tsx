import { focusManager, QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {},
});

export const onAppStateChange = (status: AppStateStatus) => {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
};

export const useFocusManager = () => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);

    return () => subscription.remove();
  }, []);
};
