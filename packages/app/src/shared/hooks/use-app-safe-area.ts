import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from '@/shared/theme/theme';

export const useAppSafeArea = () => {
  const { top, bottom } = useSafeAreaInsets();

  return {
    top: Math.max(top, spacing.s20),
    bottom: Math.max(bottom, spacing.s20),
  };
};
