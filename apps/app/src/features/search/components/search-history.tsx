import React from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { useSearchHistoryStore } from '@/lib/zustand/stores/search-history.store';
import { haptics } from '@/shared/utils/haptics';
import { usePressOpacity } from '@/shared/hooks/use-press-opacity';

interface SearchHistoryProps {
  onSelect: (term: string) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HistoryItem: React.FC<{
  term: string;
  index: number;
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
}> = ({ term, index, onSelect, onRemove }) => {
  const { colors } = useTheme();
  const { animatedStyle, pressHandlers } = usePressOpacity();

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <AnimatedPressable
        style={animatedStyle}
        onPressIn={pressHandlers.onPressIn}
        onPressOut={pressHandlers.onPressOut}
        onPress={() => {
          haptics.selection();
          onSelect(term);
        }}
        className="flex-row items-center justify-between border-b border-border py-3"
      >
        <View className="flex-1 flex-row items-center gap-3">
          <Ionicons name="time-outline" size={18} color={colors.mutedForeground} />
          <Text variant="paragraphMedium" className="text-foreground">
            {term}
          </Text>
        </View>
        <Pressable onPress={() => onRemove(term)} hitSlop={12}>
          <Ionicons name="close" size={18} color={colors.mutedForeground} />
        </Pressable>
      </AnimatedPressable>
    </Animated.View>
  );
};

export const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelect }) => {
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
        <Pressable onPress={clearHistory}>
          <Text variant="paragraphSmall" className="text-primary">
            Limpar
          </Text>
        </Pressable>
      </View>

      {history.map((term, index) => (
        <HistoryItem key={term} term={term} index={index} onSelect={onSelect} onRemove={removeSearch} />
      ))}
    </View>
  );
};
