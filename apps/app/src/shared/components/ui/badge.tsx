import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { TouchableOpacityProps } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { ComponentProps } from 'react';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/shared/utils';
import type { TextProps } from '@/shared/components/ui/text';
import { Text } from '@/shared/components/ui/text';

const badgeVariants = cva('flex-row items-center rounded-full h-8 px-4 gap-2', {
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      destructive: 'bg-destructive',
      outline: 'border border-border bg-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const badgeTextVariants = cva('', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-white',
      outline: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const BadgeContext = React.createContext<'default' | 'secondary' | 'destructive' | 'outline' | null | undefined>(
  undefined
);

interface BadgeProps extends VariantProps<typeof badgeVariants>, TouchableOpacityProps {
  className?: string;
  testID?: string;
}

export const Badge: React.FC<React.PropsWithChildren<BadgeProps>> = (props) => {
  const { children, variant, className, testID, ...rest } = props;

  return (
    <BadgeContext.Provider value={variant}>
      <Animated.View entering={FadeIn.duration(200)}>
        <TouchableOpacity testID={testID} className={cn(badgeVariants({ variant }), className)} {...rest}>
          {children}
        </TouchableOpacity>
      </Animated.View>
    </BadgeContext.Provider>
  );
};

interface BadgeTextProps extends Omit<TextProps, 'variant'> {
  className?: string;
}

export const BadgeText: React.FC<React.PropsWithChildren<BadgeTextProps>> = (props) => {
  const { children, className } = props;

  const variant = React.useContext(BadgeContext);

  return (
    <Text variant="paragraphSmall" className={cn(badgeTextVariants({ variant }), className)} semiBold>
      {children}
    </Text>
  );
};

interface BadgeIconProps extends ComponentProps<typeof Ionicons> {
  className?: string;
}

export const BadgeIcon: React.FC<BadgeIconProps> = (props) => {
  const { className, ...rest } = props;

  const variant = React.useContext(BadgeContext);

  return <Ionicons className={cn(badgeTextVariants({ variant }), className)} size={16} {...rest} />;
};
