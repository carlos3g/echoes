import React from 'react';
import { TouchableOpacity } from 'react-native';
import type { Quote } from '@/types/entities';
import { humanizeNumber } from '@/shared/utils';
import { Text } from '@/shared/components/ui/text';
import { useTagQuoteBottomSheet } from '@/features/quote/components/tag-quote-bottom-sheet';
import { Ionicons } from '@/lib/nativewind/components';

interface TagButtonProps {
  data: Quote;
}

export const TagButton: React.FC<TagButtonProps> = (props) => {
  const { data } = props;
  const { metadata } = data;
  const { show } = useTagQuoteBottomSheet();

  const formattedTags = humanizeNumber(metadata?.tags);
  const hasTags = (metadata?.tags ?? 0) > 0;

  const handleTag = () => {
    show(data);
  };

  return (
    <TouchableOpacity
      testID="toggle-tag-button"
      className="flex-row items-center gap-1"
      onPress={handleTag}
      accessibilityLabel="Adicionar tag"
      accessibilityRole="button"
      activeOpacity={0.7}
      hitSlop={12}
    >
      <Ionicons name={hasTags ? 'pricetag' : 'pricetag-outline'} size={19} className="text-muted-foreground" />
      <Text variant="paragraphSmall" className="text-muted-foreground">
        {formattedTags}
      </Text>
    </TouchableOpacity>
  );
};
