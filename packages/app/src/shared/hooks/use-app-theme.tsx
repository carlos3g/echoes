import { useTheme } from '@shopify/restyle';
import type { Theme } from '@/shared/theme/theme';

export const useAppTheme = () => {
  return useTheme<Theme>();
};
