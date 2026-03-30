import { TagCard, TagCardSkeleton } from '@/features/tag/components/tag-card';
import { useTagQuoteBottomSheet } from '@/features/quote/components/tag-quote-bottom-sheet/tag-quote-bottom-sheet.context';
import { useTagQuote } from '@/features/quote/hooks/use-tag-quote';
import { useUntagQuote } from '@/features/quote/hooks/use-untag-quote';
import { useTagContextMenu } from '@/features/tag/hooks/use-tag-context-menu';
import type { Tag } from '@/types/entities';
import React from 'react';

interface TagListItemProps {
  item: Tag;
  isTagged: boolean;
}

export const TagListItem: React.FC<TagListItemProps> = React.memo(({ item: tag, isTagged }) => {
  const { quote } = useTagQuoteBottomSheet();
  const { showContextMenu } = useTagContextMenu();

  const tagMutation = useTagQuote({ tag });
  const untagMutation = useUntagQuote({ tag });

  const handleTag = () => {
    if (!quote) return;

    if (isTagged) {
      untagMutation.mutate(quote.uuid);
    } else {
      tagMutation.mutate(quote.uuid);
    }
  };

  return (
    <TagCard
      data={tag}
      key={tag.uuid}
      onPress={handleTag}
      onLongPress={() => showContextMenu(tag)}
      icon={isTagged ? 'solid' : 'outline'}
      disabled={tagMutation.isPending || untagMutation.isPending}
    />
  );
});

export const TagListItemSkeleton: React.FC = () => <TagCardSkeleton />;
