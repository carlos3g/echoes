import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import type { ViewProps } from 'react-native';
import { Text } from '@/shared/components/ui/text';
import type { ScreenProps } from '@/shared/components/ui/screen';
import { cn } from '@/shared/utils';

const ICON_SIZE = 20;

interface ScreenHeaderProps extends Pick<ScreenProps, 'title' | 'canGoBack' | 'HeaderComponent'>, ViewProps {
  className?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = (props) => {
  const { canGoBack, title, HeaderComponent, className, ...viewProps } = props;

  const navigation = useNavigation();

  if (!title && !canGoBack && !HeaderComponent) {
    return null;
  }

  const showBackLabel = !title && !HeaderComponent;

  return (
    <View className={cn('flex-row items-center justify-between mb-s-24', className)} {...viewProps}>
      {canGoBack && (
        <TouchableOpacity
          testID="screen-back-button"
          className={cn('flex-row items-center', showBackLabel ? 'mr-s-10' : undefined)}
          onPress={navigation.goBack}
        >
          <Ionicons size={ICON_SIZE} name="arrow-back" color="primary" />
          {showBackLabel && (
            <Text variant="paragraphMedium" semiBold className="ml-s-8">
              Voltar
            </Text>
          )}
        </TouchableOpacity>
      )}
      {HeaderComponent}
      {title && <Text variant="headingSmall">{title}</Text>}
      {title && <View className={cn(`bg-carrot-secondary w-${ICON_SIZE}`)} />}
    </View>
  );
};
