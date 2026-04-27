import React, { useState } from 'react';
import { View, Pressable, Text as RNText } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { useCompareMonths } from '@/features/insights/hooks/use-compare-months';
import { formatDelta } from '@/features/insights/utils/format-delta';
import { navigateMonth, formatMonthLabel } from '@/features/insights/utils/date';

interface MonthComparisonProps {
  currentMonth: string;
}

const METRIC_KEYS = [
  'quotesRead',
  'quotesFavorited',
  'quotesShared',
  'authorsFavorited',
  'tagsCreated',
  'uniqueAuthors',
] as const;

export const MonthComparison: React.FC<MonthComparisonProps> = ({ currentMonth }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [monthA, setMonthA] = useState(navigateMonth(currentMonth, -1));
  const [monthB, setMonthB] = useState(currentMonth);

  const { data, isLoading } = useCompareMonths({ monthA, monthB });

  return (
    <Animated.View entering={FadeInUp.delay(240).duration(400).springify()} className="rounded-xl bg-card p-3.5">
      <Text variant="headingSmall" bold className="mb-3 text-foreground">
        {t('insights.monthComparison')}
      </Text>

      {/* Month selectors */}
      <View className="mb-4 flex-row items-center justify-between">
        {/* Month A selector */}
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => setMonthA(navigateMonth(monthA, -1))}
            accessibilityLabel={t('insights.monthComparison') + ' A: ' + t('common.previous')}
            accessibilityRole="button"
            style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
          >
            <RNText style={{ fontSize: 16, color: colors.foreground }}>{'<'}</RNText>
          </Pressable>
          <RNText style={{ fontFamily: 'DMSans-SemiBold', fontSize: 13, color: colors.foreground }}>
            {formatMonthLabel(monthA)}
          </RNText>
          <Pressable
            onPress={() => setMonthA(navigateMonth(monthA, 1))}
            accessibilityLabel={t('insights.monthComparison') + ' A: ' + t('common.next')}
            accessibilityRole="button"
            style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
          >
            <RNText style={{ fontSize: 16, color: colors.foreground }}>{'>'}</RNText>
          </Pressable>
        </View>

        <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
          vs
        </Text>

        {/* Month B selector */}
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={() => setMonthB(navigateMonth(monthB, -1))}
            accessibilityLabel={t('insights.monthComparison') + ' B: ' + t('common.previous')}
            accessibilityRole="button"
            style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
          >
            <RNText style={{ fontSize: 16, color: colors.foreground }}>{'<'}</RNText>
          </Pressable>
          <RNText style={{ fontFamily: 'DMSans-SemiBold', fontSize: 13, color: colors.foreground }}>
            {formatMonthLabel(monthB)}
          </RNText>
          <Pressable
            onPress={() => setMonthB(navigateMonth(monthB, 1))}
            accessibilityLabel={t('insights.monthComparison') + ' B: ' + t('common.next')}
            accessibilityRole="button"
            style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
          >
            <RNText style={{ fontSize: 16, color: colors.foreground }}>{'>'}</RNText>
          </Pressable>
        </View>
      </View>

      {isLoading ? (
        <Text variant="paragraphCaptionSmall" className="text-center text-muted-foreground">
          ...
        </Text>
      ) : data ? (
        <View className="gap-2">
          {METRIC_KEYS.map((key) => {
            const valueA = data.monthA[key];
            const valueB = data.monthB[key];
            const delta = formatDelta(valueB, valueA);
            const deltaColor = delta.isPositive ? colors.success : colors.destructive;

            return (
              <View key={key} className="flex-row items-center justify-between py-1">
                <Text variant="paragraphCaptionSmall" className="flex-1 text-muted-foreground">
                  {t(`insights.${key}`)}
                </Text>
                <View className="flex-row items-center gap-3">
                  <RNText
                    style={{
                      fontFamily: 'DMSans-SemiBold',
                      fontSize: 14,
                      color: colors.foreground,
                      width: 32,
                      textAlign: 'right',
                    }}
                  >
                    {valueA}
                  </RNText>
                  <RNText
                    style={{
                      fontFamily: 'DMSans-SemiBold',
                      fontSize: 14,
                      color: colors.foreground,
                      width: 32,
                      textAlign: 'right',
                    }}
                  >
                    {valueB}
                  </RNText>
                  <RNText
                    style={{
                      fontFamily: 'DMSans-SemiBold',
                      fontSize: 11,
                      color: delta.text === '—' ? colors.mutedForeground : deltaColor,
                      width: 48,
                      textAlign: 'right',
                    }}
                  >
                    {delta.text}
                  </RNText>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </Animated.View>
  );
};
