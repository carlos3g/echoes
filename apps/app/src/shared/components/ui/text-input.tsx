import type React from 'react';
import { useRef } from 'react';
import type { TextInputProps as RNTextInputProps } from 'react-native';
import { Pressable, TextInput as RNTextInput, View } from 'react-native';
import { cn } from '@/shared/utils';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  errorMessage?: string;
  RightComponent?: React.ReactElement;
  LeftComponent?: React.ReactElement;
  boxClassName?: string;
}

export const TextInput: React.FC<TextInputProps> = (props) => {
  const { label, errorMessage, RightComponent, LeftComponent, boxClassName, ...rnTextInputProps } = props;

  const inputRef = useRef<RNTextInput>(null);
  const { colors } = useTheme();

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <View className={cn('shrink grow', boxClassName)}>
      <Pressable onPress={focusInput}>
        {label && (
          <Text variant="paragraphMedium" semiBold className="mb-1">
            {label}
          </Text>
        )}
        <View
          className={cn(
            'flex-row rounded-xl bg-card p-4',
            errorMessage ? 'border-2 border-destructive' : 'border border-border'
          )}
        >
          {LeftComponent && <View className="mr-4 justify-center">{LeftComponent}</View>}
          <RNTextInput
            autoCapitalize="none"
            ref={inputRef}
            placeholderTextColor={colors.mutedForeground}
            className="shrink grow p-0 font-dm-sans-regular text-paragraph-medium text-foreground"
            {...rnTextInputProps}
          />
          {RightComponent && <View className="ml-4 justify-center">{RightComponent}</View>}
        </View>
        {errorMessage && (
          <Text variant="paragraphSmall" bold className="text-destructive">
            {errorMessage}
          </Text>
        )}
      </Pressable>
    </View>
  );
};
