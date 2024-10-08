import type React from 'react';
import { useRef } from 'react';
import type { TextInputProps as RNTextInputProps, TextStyle } from 'react-native';
import { Pressable, TextInput as RNTextInput } from 'react-native';
import { useAppTheme } from '@/shared/hooks/use-app-theme';
import { Box } from '@/shared/components/ui/box';
import type { BoxProps } from '@/shared/components/ui/box';
import { $fontFamily, $fontSizes, Text } from '@/shared/components/ui/text';
import { colors as themeColors } from '@/shared/theme/colors';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  errorMessage?: string;
  RightComponent?: React.ReactElement;
  LeftComponent?: React.ReactElement;
  boxProps?: BoxProps;
  containerProps?: BoxProps;
}

export const TextInput = ({
  label,
  errorMessage,
  RightComponent,
  LeftComponent,
  boxProps,
  containerProps,
  ...rnTextInputProps
}: TextInputProps) => {
  const { colors } = useAppTheme();
  const inputRef = useRef<RNTextInput>(null);

  const $textInputContainer: BoxProps = {
    flexDirection: 'row',
    borderWidth: errorMessage ? 2 : 1,
    borderColor: errorMessage ? 'error' : 'gray4',
    padding: 's16',
    borderRadius: 's12',
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <Box flexGrow={1} flexShrink={1} {...boxProps}>
      <Pressable onPress={focusInput}>
        {label && (
          <Text preset="paragraphMedium" marginBottom="s4">
            {label}
          </Text>
        )}
        <Box {...$textInputContainer} {...containerProps} backgroundColor="grayWhite">
          {LeftComponent && (
            <Box justifyContent="center" mr="s16">
              {LeftComponent}
            </Box>
          )}
          <RNTextInput
            autoCapitalize="none"
            ref={inputRef}
            placeholderTextColor={colors.gray2}
            style={$textInputStyle}
            {...rnTextInputProps}
          />
          {RightComponent && (
            <Box justifyContent="center" ml="s16">
              {RightComponent}
            </Box>
          )}
        </Box>
        {errorMessage && (
          <Text color="error" preset="paragraphSmall" bold>
            {errorMessage}
          </Text>
        )}
      </Pressable>
    </Box>
  );
};

export const $textInputStyle: TextStyle = {
  padding: 0,
  flexGrow: 1,
  flexShrink: 1,
  color: themeColors.palette.grayBlack,
  fontFamily: $fontFamily.regular,
  ...$fontSizes.paragraphMedium,
};
