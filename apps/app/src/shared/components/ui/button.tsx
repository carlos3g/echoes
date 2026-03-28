import { cva } from 'class-variance-authority';
import type React from 'react';
import type { TouchableOpacityProps } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { cn } from '@/shared/utils';
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
      class: 'font-poppins-regular text-paragraph-small',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    state: 'default',
  },
});

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  loading?: boolean;
  variant?: ButtonPreset;
  disabled?: boolean;
  className?: string;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    title,
    loading,
    variant = 'primary',
    disabled,
    className,
    testID = 'button',
    ...touchableOpacityProps
  } = props;

  const state = disabled ? 'disabled' : 'default';

  return (
    <TouchableOpacity
      testID={testID}
      disabled={disabled || loading}
      className={cn(buttonContainerStyles({ variant, state }), className)}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...touchableOpacityProps}
    >
      {loading ? (
        <ActivityIndicator className={buttonContentStyles({ variant, state })} />
      ) : (
        <Text variant="paragraphMedium" bold className={buttonContentStyles({ variant, state })}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
