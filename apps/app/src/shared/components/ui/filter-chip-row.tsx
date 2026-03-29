import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/shared/components/ui/text';
import { cn } from '@/shared/utils';

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

export const FilterChipRow: React.FC<FilterChipRowProps> = ({
  items,
  selectedUuid,
  onSelect,
  allLabel = 'Todos',
}) => {
  if (items.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4 py-2 gap-2"
      style={{ flexGrow: 0 }}
    >
      <TouchableOpacity
        onPress={() => onSelect(undefined)}
        activeOpacity={0.7}
        className={cn(
          'rounded-full border px-3 py-2',
          !selectedUuid ? 'border-primary bg-primary' : 'border-border bg-muted'
        )}
      >
        <Text
          variant="paragraphSmall"
          semiBold
          className={cn(!selectedUuid ? 'text-primary-foreground' : 'text-foreground')}
        >
          {allLabel}
        </Text>
      </TouchableOpacity>

      {items.map((item) => (
        <TouchableOpacity
          key={item.uuid}
          onPress={() => onSelect(selectedUuid === item.uuid ? undefined : item.uuid)}
          activeOpacity={0.7}
          className={cn(
            'rounded-full border px-3 py-2',
            selectedUuid === item.uuid ? 'border-primary bg-primary' : 'border-border bg-muted'
          )}
        >
          <Text
            variant="paragraphSmall"
            semiBold
            className={cn(selectedUuid === item.uuid ? 'text-primary-foreground' : 'text-foreground')}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
