import React from 'react';
import { View, Text as RNText } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { Ionicons } from '@/lib/nativewind/components';
import { useTheme } from '@/lib/nativewind/theme.context';

interface StreakCardProps {
  current: number;
  record: number;
  compact?: boolean;
}

export const StreakCard: React.FC<StreakCardProps> = ({ current, record, compact = false }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const isNewRecord = current >= record && current > 0;

  if (compact) {
    return (
      <View className="flex-row items-center gap-3 rounded-xl bg-muted px-3 py-2">
        <Ionicons name="flame-outline" size={20} className="text-primary" />
        <View className="flex-1 flex-row items-baseline gap-1">
          <RNText style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: colors.foreground }}>
            {current}
          </RNText>
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {t('insights.streak.days')}
          </Text>
        </View>
        <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
          {t('insights.streak.record')}: {record}
        </Text>
        {isNewRecord ? (
          <Text variant="paragraphCaptionSmall" className="text-success">
            {t('insights.streak.newRecord')}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(400).springify()} className="rounded-xl bg-card p-4">
      <Text variant="headingSmall" bold className="mb-3 text-foreground">
        {t('insights.streak.title')}
      </Text>

      <View className="flex-row items-center gap-6">
        <View className="items-center">
          <RNText style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 36, color: colors.foreground }}>
            {current}
          </RNText>
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {t('insights.streak.current')}
          </Text>
        </View>

        <View className="items-center">
          <RNText style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 36, color: colors.foreground }}>
            {record}
          </RNText>
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {t('insights.streak.record')}
          </Text>
        </View>
      </View>

      {isNewRecord ? (
        <RNText
          style={{
            fontFamily: 'DMSans-SemiBold',
            fontSize: 13,
            color: colors.success,
            marginTop: 8,
          }}
        >
          {t('insights.streak.newRecord')}
        </RNText>
      ) : null}
    </Animated.View>
  );
};
