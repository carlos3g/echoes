import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils';
import { haptics } from '@/shared/utils/haptics';
import { usePressScale } from '@/shared/hooks/use-press-scale';

interface FilterChipItem {
  uuid: string;
  title: string;
}

interface FilterChipRowProps {
  items: FilterChipItem[];
  selectedUuid: string | undefined;
  onSelect: (uuid: string | undefined) => void;
  allLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AnimatedChip: React.FC<{ label: string; isActive: boolean; onPress: () => void }> = React.memo(
  ({ label, isActive, onPress }) => {
    const { animatedStyle, pressHandlers } = usePressScale(0.92);

    return (
      <AnimatedPressable
        style={animatedStyle}
        onPressIn={pressHandlers.onPressIn}
        onPressOut={pressHandlers.onPressOut}
        onPress={() => {
          haptics.light();
          onPress();
        }}
        className={cn(
          'rounded-full border px-3 py-2',
          isActive ? 'border-primary bg-primary' : 'border-border bg-muted'
        )}
      >
        <Text
          variant="paragraphSmall"
          semiBold
          className={cn(isActive ? 'text-primary-foreground' : 'text-foreground')}
        >
          {label}
        </Text>
      </AnimatedPressable>
    );
  }
);

export const FilterChipRow: React.FC<FilterChipRowProps> = ({ items, selectedUuid, onSelect, allLabel = 'Todos' }) => {
  if (items.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 py-2 gap-2"
      style={{ flexGrow: 0 }}
    >
      <AnimatedChip label={allLabel} isActive={!selectedUuid} onPress={() => onSelect(undefined)} />
      {items.map((item) => (
        <AnimatedChip
          key={item.uuid}
          label={item.title}
          isActive={selectedUuid === item.uuid}
          onPress={() => onSelect(selectedUuid === item.uuid ? undefined : item.uuid)}
        />
      ))}
    </ScrollView>
  );
};
