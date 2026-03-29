import React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils';

interface AvatarInitialsProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-12 w-12',
  md: 'h-16 w-16',
  lg: 'h-[72px] w-[72px]',
};

const textVariants = {
  sm: 'paragraphSmall' as const,
  md: 'headingSmall' as const,
  lg: 'headingMedium' as const,
};

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export const AvatarInitials: React.FC<AvatarInitialsProps> = ({ name, size = 'md', className }) => {
  return (
    <View className={cn('items-center justify-center rounded-full bg-secondary', sizeClasses[size], className)}>
      <Text variant={textVariants[size]} bold className="text-secondary-foreground">
        {getInitials(name)}
      </Text>
    </View>
  );
};
