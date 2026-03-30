import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils';
import { haptics } from '@/shared/utils/haptics';
import { usePressScale } from '@/shared/hooks/use-press-scale';

export interface FilterChipItem {
  uuid: string;
  title: string;
}

interface FilterChipRowProps {
  items: FilterChipItem[];
  selectedUuids: string[];
  onSelect: (uuids: string[]) => void;
  onLongPress?: (item: FilterChipItem) => void;
  allLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AnimatedChip: React.FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}> = React.memo(({ label, isActive, onPress, onLongPress }) => {
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
      onLongPress={
        onLongPress
          ? () => {
              haptics.light();
              onLongPress();
            }
          : undefined
      }
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
});

export const FilterChipRow: React.FC<FilterChipRowProps> = ({ items, selectedUuids, onSelect, onLongPress, allLabel }) => {
  const { t } = useTranslation();
  const resolvedAllLabel = allLabel ?? t('common.allMasculine');

  if (items.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 py-2 gap-2"
      style={{ flexGrow: 0 }}
    >
      <AnimatedChip label={resolvedAllLabel} isActive={selectedUuids.length === 0} onPress={() => onSelect([])} />
      {items.map((item) => (
        <AnimatedChip
          key={item.uuid}
          label={item.title}
          isActive={selectedUuids.includes(item.uuid)}
          onPress={() => {
            if (selectedUuids.includes(item.uuid)) {
              onSelect(selectedUuids.filter((uuid) => uuid !== item.uuid));
            } else {
              onSelect([...selectedUuids, item.uuid]);
            }
          }}
          onLongPress={onLongPress ? () => onLongPress(item) : undefined}
        />
      ))}
    </ScrollView>
  );
};
