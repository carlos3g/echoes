import React from 'react';
import { View } from 'react-native';
import { Badge, BadgeIcon, BadgeText } from '@/shared/components/ui/badge';

interface QuoteFilterBadgeProps {
  tagTitles: string[];
  onClear: () => void;
}

export const QuoteFilterBadge: React.FC<QuoteFilterBadgeProps> = ({ tagTitles, onClear }) => {
  if (tagTitles.length === 0) return null;

  return (
    <View testID="quotes-filter-container" className="flex-row gap-2 px-4 pt-4">
      <Badge testID="quotes-clear-filter-button" className="pl-2" onPress={onClear}>
        <BadgeIcon name="close" />
        <BadgeText>{tagTitles.join(', ')}</BadgeText>
      </Badge>
    </View>
  );
};
