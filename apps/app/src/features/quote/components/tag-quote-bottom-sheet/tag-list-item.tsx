import React from 'react';
import type { ListRenderItem } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';
import type { Tag } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { TagCard, TagCardSkeleton } from '@/features/tag/components/tag-card';
import { useTagQuote } from '@/features/quote/hooks/use-tag-quote';
import { useUntagQuote } from '@/features/quote/hooks/use-untag-quote';
import { useIsQuoteTagged } from '@/features/quote/hooks/use-is-quote-tagged';
import { useTagQuoteBottomSheet } from './tag-quote-bottom-sheet.context';

const TagListItem: React.FC<{ item: Tag }> = ({ item: tag }) => {
  const { quote } = useTagQuoteBottomSheet();

  const tagMutation = useTagQuote({ tag });
  const untagMutation = useUntagQuote({ tag });
  const isTaggedQuery = useIsQuoteTagged({ quoteUuid: quote?.uuid ?? '', tagUuid: tag.uuid });

  const isTagged = isTaggedQuery.data?.exists;

  const handleTag = () => {
    if (!quote) {
      return;
    }

    if (isTagged) {
      untagMutation.mutate(quote.uuid);
      return;
    }

    tagMutation.mutate(quote.uuid);
  };

  return (
    <TagCard
      data={tag}
      key={tag.uuid}
      onPress={handleTag}
      icon={isTagged ? 'solid' : 'outline'}
      disabled={tagMutation.isPending || untagMutation.isPending}
    />
  );
};

export const renderItem: ListRenderItem<Tag> = ({ item }) => <TagListItem item={item} />;

export const renderItemSkeleton: ListRenderItem<Tag> = () => <TagCardSkeleton />;

export const ItemSeparatorComponent = React.memo(() => (
  <View className="bg-border" style={{ height: StyleSheet.hairlineWidth }} />
));

export const ListEmptyComponent = React.memo(() => (
  <View className="items-center">
    <Text>Nenhuma tag cadastrada</Text>
  </View>
));
