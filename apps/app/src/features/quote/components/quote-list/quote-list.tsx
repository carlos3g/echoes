import React, { useCallback, useMemo } from 'react';
import { Pressable, RefreshControl, View } from 'react-native';
import type { ListRenderItem } from '@shopify/flash-list';
import type { Quote } from '@/types/entities';
import { QuoteCardSkeleton } from '@/features/quote/components/quote-card';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { FlashList } from '@/shared/components/ui/flash-list';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { haptics } from '@/shared/utils/haptics';
import { QuoteListItem } from './quote-list-item';

const renderItem: ListRenderItem<Quote> = ({ item, index }) => <QuoteListItem item={item} index={index} />;

const renderItemSkeleton: ListRenderItem<Quote> = () => <QuoteCardSkeleton />;

const QuoteListEmpty = React.memo(() => (
  <EmptyState
    icon="chatbubble-outline"
    title="Nenhuma citacao encontrada"
    description="Tente ajustar os filtros ou volte mais tarde"
  />
));

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = React.memo(
  ({ currentPage, lastPage, onPrevious, onNext }) => {
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < lastPage;

    return (
      <View className="flex-row items-center justify-center gap-4 py-4">
        <Pressable
          onPress={() => {
            haptics.light();
            onPrevious();
          }}
          disabled={!hasPrevious}
          className={`rounded-xl border px-4 py-2 ${hasPrevious ? 'border-primary bg-primary' : 'border-border bg-muted'}`}
        >
          <Text
            variant="paragraphSmall"
            semiBold
            className={hasPrevious ? 'text-primary-foreground' : 'text-muted-foreground'}
          >
            Anterior
          </Text>
        </Pressable>

        <Text variant="paragraphSmall" className="text-muted-foreground">
          {currentPage} / {lastPage}
        </Text>

        <Pressable
          onPress={() => {
            haptics.light();
            onNext();
          }}
          disabled={!hasNext}
          className={`rounded-xl border px-4 py-2 ${hasNext ? 'border-primary bg-primary' : 'border-border bg-muted'}`}
        >
          <Text
            variant="paragraphSmall"
            semiBold
            className={hasNext ? 'text-primary-foreground' : 'text-muted-foreground'}
          >
            Proximo
          </Text>
        </Pressable>
      </View>
    );
  }
);

interface QuoteListProps {
  quotes: Quote[];
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => void;
  onEndReached: () => void;
  currentPage?: number;
  lastPage?: number;
  onPageChange?: (page: number) => void;
}

export const QuoteList: React.FC<QuoteListProps> = ({
  quotes,
  isLoading,
  isRefetching,
  onRefresh,
  onEndReached,
  currentPage,
  lastPage,
  onPageChange,
}) => {
  const { colors } = useTheme();
  const isPaginated = currentPage !== undefined && lastPage !== undefined && onPageChange !== undefined;

  const handlePrevious = useCallback(() => {
    if (isPaginated) onPageChange!(currentPage! - 1);
  }, [isPaginated, onPageChange, currentPage]);

  const handleNext = useCallback(() => {
    if (isPaginated) onPageChange!(currentPage! + 1);
  }, [isPaginated, onPageChange, currentPage]);

  const footer = useMemo(() => {
    if (!isPaginated || isLoading || quotes.length === 0) return undefined;
    return (
      <PaginationControls
        currentPage={currentPage!}
        lastPage={lastPage!}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    );
  }, [isPaginated, isLoading, quotes.length, currentPage, lastPage, handlePrevious, handleNext]);

  const refreshControl = useMemo(
    () => <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} tintColor={colors.primary} />,
    [isRefetching, onRefresh, colors.primary]
  );

  return (
    <View className="flex-1 bg-background">
      <FlashList
        data={isLoading ? Array(10).fill(null) : quotes}
        renderItem={isLoading ? renderItemSkeleton : renderItem}
        onEndReached={isPaginated ? undefined : onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        ListEmptyComponent={QuoteListEmpty}
        ListFooterComponent={footer}
      />
    </View>
  );
};
