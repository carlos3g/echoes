import React from 'react';
import { View, TextInput as RNTextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/nativewind/theme.context';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  testID?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder = 'Buscar...', testID }) => {
  const { colors } = useTheme();

  return (
    <View className="mx-4 mt-3 mb-2 flex-row items-center rounded-xl bg-muted px-4 py-3">
      <Ionicons name="search-outline" size={18} color={colors.mutedForeground} />
      <RNTextInput
        className="ml-3 flex-1 font-dm-sans-regular text-paragraph-medium text-foreground"
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
        testID={testID}
      />
    </View>
  );
};
