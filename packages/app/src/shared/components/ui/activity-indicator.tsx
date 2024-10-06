import type { ActivityIndicatorProps } from 'react-native';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';
import { useAppTheme } from '@/shared/hooks/use-app-theme';
import type { ThemeColors } from '@/shared/theme/theme';

interface Props extends Omit<ActivityIndicatorProps, 'color'> {
  color?: ThemeColors;
}
export const ActivityIndicator = ({ color = 'primary', ...rest }: Props) => {
  const { colors } = useAppTheme();

  return <RNActivityIndicator testID="activity-indicator" color={colors[color]} {...rest} />;
};
