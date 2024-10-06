import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { BoxProps } from '@/shared/components/ui/box';
import { Box, TouchableOpacityBox } from '@/shared/components/ui/box';
import type { ScreenProps } from '@/shared/components/ui/screen';
import { Text } from '@/shared/components/ui/text';

const ICON_SIZE = 20;
type Props = Pick<ScreenProps, 'title' | 'canGoBack' | 'HeaderComponent'> & BoxProps;
export const ScreenHeader = ({ canGoBack, title, HeaderComponent, ...boxProps }: Props) => {
  const navigation = useNavigation();

  if (!title && !canGoBack && !HeaderComponent) {
    return null;
  }

  const showBackLabel = !title && !HeaderComponent;

  return (
    <Box flexDirection="row" mb="s24" alignItems="center" justifyContent="space-between" {...boxProps}>
      {canGoBack && (
        <TouchableOpacityBox
          testID="screen-back-button"
          flexDirection="row"
          alignItems="center"
          mr={showBackLabel ? 's10' : undefined}
          onPress={navigation.goBack}
        >
          <Ionicons size={ICON_SIZE} name="arrow-back" color="primary" />
          {showBackLabel && (
            <Text preset="paragraphMedium" semiBold ml="s8">
              Voltar
            </Text>
          )}
        </TouchableOpacityBox>
      )}
      {HeaderComponent}
      {title && <Text preset="headingSmall">{title}</Text>}
      {title && <Box backgroundColor="carrotSecondary" width={ICON_SIZE} />}
    </Box>
  );
};
