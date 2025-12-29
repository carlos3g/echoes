import React from 'react';
import { useRouter } from 'expo-router';
import type { Quote } from '@/types/entities';
import { QuoteCard } from '@/features/quote/components/quote-card';

interface QuoteListItemProps {
  item: Quote;
}

export const QuoteListItem: React.FC<QuoteListItemProps> = ({ item }) => {
  const router = useRouter();

  return <QuoteCard data={item} onPress={() => router.push(`/(app)/(tabs)/(quotes)/${item.uuid}`)} />;
};
