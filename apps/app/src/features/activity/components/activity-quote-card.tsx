import React from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/shared/components/ui/text';
import { haptics } from '@/shared/utils/haptics';

interface ActivityQuoteCardProps {
  uuid: string;
  content: string;
  author: string;
}

export const ActivityQuoteCard: React.FC<ActivityQuoteCardProps> = ({ uuid, content, author }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        router.push({ pathname: '/(app)/(tabs)/(explore)/quote/[quoteUuid]', params: { quoteUuid: uuid } });
      }}
      className="mt-2 rounded-lg border border-border bg-card px-3 py-2.5"
    >
      <Text variant="paragraphCaptionSmall" italic className="text-muted-foreground" numberOfLines={2}>
        &ldquo;{content}&rdquo;
      </Text>
      <Text variant="paragraphCaptionSmall" className="mt-1 text-muted-foreground">
        &mdash; {author}
      </Text>
    </Pressable>
  );
};
