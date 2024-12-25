import type { ActivityIndicatorProps as RNActivityIndicatorProps } from 'react-native';
import { ActivityIndicator as RNActivityIndicator } from 'react-native';

interface ActivityIndicatorProps extends Omit<RNActivityIndicatorProps, 'color'> {}

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { ...rest } = props;

  return <RNActivityIndicator testID="activity-indicator" {...rest} />;
};
