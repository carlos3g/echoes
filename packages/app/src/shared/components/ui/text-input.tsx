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
    <View className={cn('grow shrink', boxClassName)}>
      <Pressable onPress={focusInput}>
        {label && (
          <Text variant="paragraphMedium" className="mb-s-4">
            {label}
          </Text>
        )}
        <View
          className={cn(
            'bg-gray-white rounded-s-12 p-s-16 flex-row',
            errorMessage ? 'border-2 border-error' : 'border border-gray-400'
          )}
        >
          {LeftComponent && <View className="justify-center mr-s-16">{LeftComponent}</View>}
          <RNTextInput
            autoCapitalize="none"
            ref={inputRef}
            placeholderTextColor={colors.palette.gray2}
            className="p-0 grow shrink text-gray-black font-poppins-regular text-paragraph-medium"
            {...rnTextInputProps}
          />
          {RightComponent && <View className="justify-center ml-s-16">{RightComponent}</View>}
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
