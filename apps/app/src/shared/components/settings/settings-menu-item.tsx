import React from 'react';
import type { TouchableOpacityProps } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@/lib/nativewind/components';
import { Text } from '@/shared/components/ui/text';

interface SettingsMenuItemProps extends TouchableOpacityProps {
  label: string;
  variant?: 'default' | 'destructive' | 'muted';
  testID?: string;
}

export const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ label, variant = 'default', testID, ...rest }) => {
  const textClassName =
    variant === 'destructive' ? 'text-destructive' : variant === 'muted' ? 'text-muted-foreground' : '';

  const iconClassName =
    variant === 'destructive' ? 'text-destructive' : variant === 'muted' ? 'text-muted-foreground' : '';

  return (
    <TouchableOpacity
      testID={testID}
      className="min-h-[44px] flex-row items-center justify-between py-4"
      accessibilityLabel={label}
      accessibilityRole="button"
      activeOpacity={0.7}
      {...rest}
    >
      <Text className={textClassName}>{label}</Text>
      <Ionicons name="chevron-forward" size={24} className={iconClassName || 'text-muted-foreground'} />
    </TouchableOpacity>
  );
};
