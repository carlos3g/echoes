import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

  const router = useRouter();

  if (!title && !canGoBack && !HeaderComponent) {
    return null;
  }

  const showBackLabel = !title && !HeaderComponent;

  return (
    <View className={cn('mb-6 flex-row items-center justify-between', className)} {...viewProps}>
      {canGoBack && (
        <TouchableOpacity
          testID="screen-back-button"
          className={cn('flex-row items-center', showBackLabel ? 'mr-2.5' : undefined)}
          onPress={() => router.back()}
        >
          <Ionicons size={ICON_SIZE} name="arrow-back" color="#18181b" />
          {showBackLabel && (
            <Text variant="paragraphMedium" semiBold className="ml-2">
              Voltar
            </Text>
          )}
        </TouchableOpacity>
      )}
      {HeaderComponent}
      {title && <Text variant="headingSmall">{title}</Text>}
      {title && <View className={cn(`bg-zinc-500 w-${ICON_SIZE}`)} />}
    </View>
  );
};
