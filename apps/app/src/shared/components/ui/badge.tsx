import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import type { TouchableOpacityProps } from 'react-native';
import { TouchableOpacity } from 'react-native';
import type { ComponentProps } from 'react';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '@/shared/utils';
import type { TextProps } from '@/shared/components/ui/text';
import { Text } from '@/shared/components/ui/text';

const badgeVariants = cva('flex-row items-center rounded-md h-8 border border-primary px-4 gap-2', {
  variants: {
    variant: {
      default: 'border-transparent bg-primary shadow',
      secondary: 'border-transparent bg-carrot-secondary',
      destructive: 'border-transparent bg-error shadow',
      outline: 'border-background-contrast',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const badgeTextVariants = cva('', {
  variants: {
    variant: {
      default: 'text-primary-contrast',
      secondary: 'text-white',
      destructive: 'text-white',
      outline: 'text-background-contrast',
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
}

export const Badge: React.FC<React.PropsWithChildren<BadgeProps>> = (props) => {
  const { children, variant, className, ...rest } = props;

  return (
    <BadgeContext.Provider value={variant}>
      <TouchableOpacity className={cn(badgeVariants({ variant }), className)} {...rest}>
        {children}
      </TouchableOpacity>
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
    <Text variant="paragraphMedium" className={cn(badgeTextVariants({ variant }), className)} semiBold>
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
