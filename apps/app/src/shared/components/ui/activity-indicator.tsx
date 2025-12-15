import type { ActivityIndicatorProps as RNActivityIndicatorProps } from 'react-native';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';

export const ActivityIndicator: React.FC<Omit<RNActivityIndicatorProps, 'color'>> = (props) => {
  const { ...rest } = props;

  return <RNActivityIndicator testID="activity-indicator" {...rest} />;
};
