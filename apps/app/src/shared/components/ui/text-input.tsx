import type React from 'react';
import { useRef } from 'react';
import type { TextInputProps as RNTextInputProps } from 'react-native';
import { Pressable, TextInput as RNTextInput, View } from 'react-native';
import { cn } from '@/shared/utils';
import { colors } from '@/shared/theme/colors';
import { Text } from '@/shared/components/ui/text';

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

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <View className={cn('shrink grow', boxClassName)}>
      <Pressable onPress={focusInput}>
        {label && (
          <Text variant="paragraphMedium" className="mb-s-4">
            {label}
          </Text>
        )}
        <View
          className={cn(
            'flex-row rounded-s-12 bg-gray-white p-s-16',
            errorMessage ? 'border-2 border-error' : 'border border-gray-400'
          )}
        >
          {LeftComponent && <View className="mr-s-16 justify-center">{LeftComponent}</View>}
          <RNTextInput
            autoCapitalize="none"
            ref={inputRef}
            placeholderTextColor={colors.palette.gray2}
            className="shrink grow p-0 font-poppins-regular text-paragraph-medium text-gray-black"
            {...rnTextInputProps}
          />
          {RightComponent && <View className="ml-s-16 justify-center">{RightComponent}</View>}
        </View>
        {errorMessage && (
          <Text variant="paragraphSmall" bold className="text-error">
            {errorMessage}
          </Text>
        )}
      </Pressable>
    </View>
  );
};
