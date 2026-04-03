import React, { useMemo } from 'react';
import { View, Text as RNText, useWindowDimensions } from 'react-native';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { hexToRgb, withOpacity } from '@/features/insights/utils/color';

const LABEL_H = 14;
const LABEL_W = 28;
const GAP = 2;
const CARD_PADDING = 16;
const SCREEN_PADDING = 16;

const DAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const HOURS_TO_SHOW = [0, 6, 12, 18, 23];

interface HourlyHeatmapProps {
  hourlyHeatmap: Array<{ dayOfWeek: number; hour: number; count: number }>;
}

export const HourlyHeatmap: React.FC<HourlyHeatmapProps> = ({ hourlyHeatmap }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const { grid, maxCount } = useMemo(() => {
    const g = new Map<string, number>();
    let max = 0;
    for (const item of hourlyHeatmap) {
      const key = `${item.dayOfWeek}-${item.hour}`;
      g.set(key, item.count);
      if (item.count > max) max = item.count;
    }
    return { grid: g, maxCount: max };
  }, [hourlyHeatmap]);

  // 24 columns (hours), calculate cell size to fill width
  const availableWidth = screenWidth - SCREEN_PADDING * 2 - CARD_PADDING * 2 - LABEL_W;
  const cellSize = Math.floor((availableWidth - GAP * 23) / 24);
  const gridWidth = 24 * (cellSize + GAP);
  const gridHeight = 7 * (cellSize + GAP);
  const primaryRgb = hexToRgb(colors.primary);

  if (hourlyHeatmap.length === 0) {
    return (
      <Animated.View entering={FadeInUp.duration(400)} className="rounded-2xl bg-card p-4">
        <Text variant="paragraphSmall" bold className="mb-3 text-muted-foreground">
          {t('insights.hourlyHeatmap')}
        </Text>
        <Text variant="paragraphCaptionSmall" className="text-center text-muted-foreground">
          {t('insights.noDataYet')}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(400)} className="rounded-2xl bg-card p-4">
      <Text variant="paragraphSmall" bold className="mb-3 text-muted-foreground">
        {t('insights.hourlyHeatmap')}
      </Text>

      {/* Hour labels on top */}
      <View className="flex-row" style={{ marginLeft: LABEL_W, marginBottom: 2 }}>
        {Array.from({ length: 24 }, (_, h) => (
          <View key={h} style={{ width: cellSize + GAP, alignItems: 'center' }}>
            {HOURS_TO_SHOW.includes(h) && <RNText style={{ fontSize: 8, color: colors.mutedForeground }}>{h}</RNText>}
          </View>
        ))}
      </View>

      <View className="flex-row">
        {/* Day labels on left */}
        <View style={{ width: LABEL_W }}>
          {DAY_LABELS.map((label, i) => (
            <View key={i} style={{ height: cellSize + GAP, justifyContent: 'center' }}>
              <RNText style={{ fontSize: 9, color: colors.mutedForeground }}>{label}</RNText>
            </View>
          ))}
        </View>

        {/* Grid: 7 rows (days) x 24 cols (hours) */}
        <Canvas style={{ width: gridWidth, height: gridHeight }} accessibilityLabel={t('insights.hourlyHeatmap')}>
          {Array.from({ length: 7 }, (_, dow) =>
            Array.from({ length: 24 }, (__, hour) => {
              const count = grid.get(`${dow}-${hour}`) ?? 0;
              const opacity = maxCount === 0 ? 0.08 : 0.08 + (count / maxCount) * 0.77;
              return (
                <RoundedRect
                  key={`${dow}-${hour}`}
                  x={hour * (cellSize + GAP)}
                  y={dow * (cellSize + GAP)}
                  width={cellSize}
                  height={cellSize}
                  r={2}
                  color={withOpacity(primaryRgb, opacity)}
                />
              );
            })
          )}
        </Canvas>
      </View>

      <View className="mt-2 flex-row items-center justify-end gap-1">
        <RNText style={{ fontSize: 9, color: colors.mutedForeground }}>{t('insights.less')}</RNText>
        {[0.08, 0.3, 0.55, 0.85].map((op, i) => (
          <View
            key={i}
            style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: withOpacity(primaryRgb, op) }}
          />
        ))}
        <RNText style={{ fontSize: 9, color: colors.mutedForeground }}>{t('insights.more')}</RNText>
      </View>
    </Animated.View>
  );
};
