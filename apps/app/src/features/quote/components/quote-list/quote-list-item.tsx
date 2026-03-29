import React from 'react';
import { useRouter } from 'expo-router';
import type { Quote } from '@/types/entities';
import { QuoteCard } from '@/features/quote/components/quote-card';

interface QuoteListItemProps {
  item: Quote;
  index?: number;
}

export const QuoteListItem: React.FC<QuoteListItemProps> = React.memo(({ item, index }) => {
  const router = useRouter();

  return (
    <QuoteCard
      data={item}
      index={index}
      onPress={() => router.push(`/(app)/(tabs)/(quotes)/${item.uuid}`)}
    />
  );
});
