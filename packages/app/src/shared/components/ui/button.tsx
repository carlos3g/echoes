import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';
import type { TouchableOpacityBoxProps } from '@/shared/components/ui/box';
import { TouchableOpacityBox } from '@/shared/components/ui/box';
import { buttonPresets } from '@/shared/components/ui/button.presets';
import { Text } from '@/shared/components/ui/text';

export type ButtonPreset = 'primary' | 'outline' | 'ghost';

export interface ButtonProps extends TouchableOpacityBoxProps {
  title: string;
  loading?: boolean;
  preset?: ButtonPreset;
  disabled?: boolean;
}

export const Button = ({ title, loading, preset = 'primary', disabled, ...touchableOpacityBoxProps }: ButtonProps) => {
  const buttonPreset = buttonPresets[preset][disabled ? 'disabled' : 'default'];
  return (
    <TouchableOpacityBox
      testID="button"
      disabled={disabled || loading}
      paddingHorizontal="s20"
      height={50}
      alignItems="center"
      justifyContent="center"
      borderRadius="s16"
      {...buttonPreset.container}
      {...touchableOpacityBoxProps}
    >
      {loading ? (
        <ActivityIndicator color={buttonPreset.content.color} />
      ) : (
        <Text preset="paragraphMedium" bold color={buttonPreset.content.color} {...buttonPreset.content.textProps}>
          {title}
        </Text>
      )}
    </TouchableOpacityBox>
  );
};
