import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MIN_SAFE_AREA = 20;

export const useAppSafeArea = () => {
  const { top, bottom } = useSafeAreaInsets();

  return {
    top: Math.max(top, MIN_SAFE_AREA),
    bottom: Math.max(bottom, MIN_SAFE_AREA),
  };
};
