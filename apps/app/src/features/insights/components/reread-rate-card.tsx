import React from 'react';
import { View, Text as RNText } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

interface RereadRateCardProps {
  rereadRate: {
    percentage: number;
    topRereads: Array<{ quoteUuid: string; content: string; author: string; count: number }>;
  };
}

export const RereadRateCard: React.FC<RereadRateCardProps> = ({ rereadRate }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(200).duration(400)} className="rounded-2xl bg-card p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text variant="paragraphSmall" bold className="text-muted-foreground">
          {t('insights.rereadRate')}
        </Text>
        <RNText style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: colors.primary }}>
          {rereadRate.percentage}%
        </RNText>
      </View>

      {rereadRate.topRereads.length > 0 && (
        <View className="gap-2">
          {rereadRate.topRereads.map((item, index) => (
            <View key={item.quoteUuid} className="flex-row items-start gap-2 border-b border-border pb-2">
              <View style={{ opacity: 0.8 - index * 0.1 }}>
                <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
                  {item.count}x
                </Text>
              </View>
              <View className="flex-1">
                <Text variant="paragraphCaptionSmall" className="text-foreground" numberOfLines={2}>
                  &ldquo;{item.content}&rdquo;
                </Text>
                <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
                  &mdash; {item.author}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
};
