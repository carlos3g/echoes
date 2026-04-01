import React from 'react';
import { View, Text as RNText } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import type { InsightsResponse } from '@/features/insights/contracts/insights-service.contract';
import { formatDelta } from '@/features/insights/utils/format-delta';

interface KpiCardsProps {
  summary: InsightsResponse['summary'];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ summary }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const cards = [
    { key: 'quotesRead', label: t('insights.quotesRead'), data: summary.quotesRead },
    { key: 'quotesFavorited', label: t('insights.quotesFavorited'), data: summary.quotesFavorited },
    { key: 'quotesShared', label: t('insights.quotesShared'), data: summary.quotesShared },
    { key: 'authorsFavorited', label: t('insights.authorsFavorited'), data: summary.authorsFavorited },
    { key: 'tagsCreated', label: t('insights.tagsCreated'), data: summary.tagsCreated },
    { key: 'uniqueAuthors', label: t('insights.uniqueAuthors'), data: summary.uniqueAuthors },
  ] as const;

  return (
    <View className="flex-row flex-wrap gap-2">
      {cards.map(({ key, label, data }, index) => {
        const delta = formatDelta(data.current, data.previous);
        const deltaColor = delta.isPositive ? colors.success : colors.destructive;

        return (
          <Animated.View
            key={key}
            entering={FadeInUp.delay(index * 80)
              .duration(400)
              .springify()}
            className="flex-1 basis-[30%] items-center rounded-xl bg-card p-3"
          >
            <RNText style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: colors.foreground }}>
              {data.current}
            </RNText>
            <Text variant="paragraphCaptionSmall" className="mt-0.5 text-center text-muted-foreground">
              {label}
            </Text>
            {delta.text !== '—' ? (
              <RNText
                style={{
                  fontFamily: 'DMSans-SemiBold',
                  fontSize: 11,
                  color: deltaColor,
                  marginTop: 2,
                }}
              >
                {delta.text}
              </RNText>
            ) : (
              <Text variant="paragraphCaptionSmall" className="mt-0.5 text-muted-foreground">
                {delta.text}
              </Text>
            )}
          </Animated.View>
        );
      })}
    </View>
  );
};
