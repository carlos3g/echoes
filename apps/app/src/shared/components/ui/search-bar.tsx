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
    <View className="flex-row items-center border-b border-border px-4 py-2">
      <Ionicons name="search-outline" size={20} color={colors.mutedForeground} />
      <RNTextInput
        className="ml-2 flex-1 text-foreground"
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
