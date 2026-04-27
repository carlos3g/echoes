import React from 'react';
import { View, Pressable, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Text } from '@/shared/components/ui/text';

interface TopAuthorsListProps {
  topAuthors: Array<{ name: string; quotesRead: number; uuid: string }>;
}

const RANK_OPACITIES = [0.8, 0.6, 0.4];

export const TopAuthorsList: React.FC<TopAuthorsListProps> = ({ topAuthors }) => {
  const { t } = useTranslation();
  const router = useRouter();

  if (!topAuthors.length) return null;

  return (
    <View>
      <Text variant="headingSmall" bold className="mb-3 text-foreground">
        {t('insights.topAuthors')}
      </Text>

      <View className="overflow-hidden rounded-xl bg-card">
        {topAuthors.map((author, index) => {
          const isLast = index === topAuthors.length - 1;
          const opacity = RANK_OPACITIES[index] ?? 0.4;

          return (
            <Pressable
              key={author.uuid}
              onPress={() =>
                router.push({
                  pathname: '/(app)/(tabs)/(explore)/author/[authorUuid]',
                  params: { authorUuid: author.uuid },
                })
              }
              className={
                isLast ? 'flex-row items-center px-4 py-3' : 'flex-row items-center border-b border-border px-4 py-3'
              }
            >
              <RNText
                style={{
                  color: `rgba(139, 168, 144, ${opacity})`,
                  marginRight: 16,
                  width: 20,
                  textAlign: 'center',
                  fontSize: 14,
                  fontFamily: 'DMSans-Bold',
                }}
              >
                {index + 1}
              </RNText>
              <Text variant="paragraphSmall" className="flex-1 text-foreground">
                {author.name}
              </Text>
              <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
                {author.quotesRead} {t('insights.quotes')}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
