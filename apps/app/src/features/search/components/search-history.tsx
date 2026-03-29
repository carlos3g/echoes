import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { useSearchHistoryStore } from '@/lib/zustand/stores/search-history.store';

interface SearchHistoryProps {
  onSelect: (term: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelect }) => {
  const { colors } = useTheme();
  const history = useSearchHistoryStore((s) => s.history);
  const removeSearch = useSearchHistoryStore((s) => s.removeSearch);
  const clearHistory = useSearchHistoryStore((s) => s.clearHistory);

  if (history.length === 0) return null;

  return (
    <View className="flex-1 px-4 pt-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text variant="paragraphSmall" semiBold className="text-foreground">
          Buscas recentes
        </Text>
        <TouchableOpacity onPress={clearHistory} activeOpacity={0.7}>
          <Text variant="paragraphSmall" className="text-primary">
            Limpar
          </Text>
        </TouchableOpacity>
      </View>

      {history.map((term) => (
        <TouchableOpacity
          key={term}
          onPress={() => onSelect(term)}
          className="flex-row items-center justify-between border-b border-border py-3"
          activeOpacity={0.7}
        >
          <View className="flex-1 flex-row items-center gap-3">
            <Ionicons name="time-outline" size={18} color={colors.mutedForeground} />
            <Text variant="paragraphMedium" className="text-foreground">
              {term}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => removeSearch(term)}
            hitSlop={12}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
};
