import React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@/lib/nativewind/components';
import { Text } from '@/shared/components/ui/text';
import { haptics } from '@/shared/utils/haptics';
import { usePressOpacity } from '@/shared/hooks/use-press-opacity';

interface SettingsMenuItemProps {
  label: string;
  variant?: 'default' | 'destructive' | 'muted';
  testID?: string;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ label, variant = 'default', testID, onPress }) => {
  const textClassName =
    variant === 'destructive' ? 'text-destructive' : variant === 'muted' ? 'text-muted-foreground' : '';
  const iconClassName =
    variant === 'destructive' ? 'text-destructive' : variant === 'muted' ? 'text-muted-foreground' : '';

  const { animatedStyle, pressHandlers } = usePressOpacity();

  return (
    <AnimatedPressable
      testID={testID}
      style={animatedStyle}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
      onPress={() => {
        haptics.selection();
        onPress?.();
      }}
      className="min-h-[44px] flex-row items-center justify-between py-4"
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text className={textClassName}>{label}</Text>
      <Ionicons name="chevron-forward" size={24} className={iconClassName || 'text-muted-foreground'} />
    </AnimatedPressable>
  );
};
