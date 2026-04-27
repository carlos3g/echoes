import React, { useRef, useState } from 'react';
import { View, TextInput as RNTextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmit?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder,
  testID,
  onFocus,
  onBlur,
  onSubmit,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t('search.placeholder');
  const inputRef = useRef<RNTextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleClear = () => {
    onChangeText('');
    inputRef.current?.focus();
  };

  const handleCancel = () => {
    onChangeText('');
    inputRef.current?.blur();
  };

  return (
    <View className="mb-2 mt-3 flex-row items-center gap-3 px-4">
      <View className="flex-1 flex-row items-center rounded-xl bg-muted px-4 py-3">
        <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
        <RNTextInput
          ref={inputRef}
          className="ml-3 flex-1 font-dm-sans-regular text-paragraph-medium text-foreground"
          placeholder={resolvedPlaceholder}
          placeholderTextColor={colors.mutedForeground}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          autoCorrect={false}
          testID={testID}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} hitSlop={12} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {isFocused && (
        <TouchableOpacity onPress={handleCancel} activeOpacity={0.7}>
          <Text variant="paragraphSmall" semiBold className="text-primary">
            {t('common.cancel')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
