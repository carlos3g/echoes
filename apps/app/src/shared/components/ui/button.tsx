import { cva } from 'class-variance-authority';
import type React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { cn } from '@/shared/utils';
import { haptics } from '@/shared/utils/haptics';
import { usePressScale } from '@/shared/hooks/use-press-scale';
import { Text } from '@/shared/components/ui/text';
import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';

export type ButtonPreset = 'primary' | 'outline' | 'ghost';

export const buttonContainerStyles = cva('px-5 h-[50px] items-center justify-center rounded-2xl', {
  variants: {
    variant: {
      primary: 'bg-primary',
      outline: 'border border-primary',
      ghost: 'bg-muted h-[40px]',
    },
    state: {
      default: '',
      disabled: 'bg-muted-foreground',
    },
  },
  compoundVariants: [
    { variant: 'primary', state: 'disabled', class: 'bg-muted-foreground' },
    { variant: 'outline', state: 'disabled', class: 'border-muted-foreground' },
    { variant: 'ghost', state: 'disabled', class: 'bg-background h-[40px]' },
  ],
  defaultVariants: {
    variant: 'primary',
    state: 'default',
  },
});

export const buttonContentStyles = cva('', {
  variants: {
    variant: {
      primary: 'text-primary-foreground',
      outline: 'text-primary',
      ghost: 'text-foreground',
    },
    state: {
      default: '',
      disabled: 'text-muted-foreground',
    },
  },
  compoundVariants: [
    {
      variant: 'ghost',
      state: 'default',
      class: 'font-dm-sans-regular text-paragraph-small',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    state: 'default',
  },
});

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface ButtonProps {
  title: string;
  loading?: boolean;
  variant?: ButtonPreset;
  disabled?: boolean;
  className?: string;
  testID?: string;
  onPress?: () => void;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const { title, loading, variant = 'primary', disabled, className, testID = 'button', onPress } = props;

  const state = disabled ? 'disabled' : 'default';
  const { animatedStyle, pressHandlers } = usePressScale();

  return (
    <AnimatedPressable
      testID={testID}
      disabled={disabled || loading}
      style={animatedStyle}
      onPressIn={() => {
        haptics.medium();
        pressHandlers.onPressIn();
      }}
      onPressOut={pressHandlers.onPressOut}
      onPress={onPress}
      className={cn(buttonContainerStyles({ variant, state }), className)}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator className={buttonContentStyles({ variant, state })} />
      ) : (
        <Text variant="paragraphMedium" bold className={buttonContentStyles({ variant, state })}>
          {title}
        </Text>
      )}
    </AnimatedPressable>
  );
};
