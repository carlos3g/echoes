import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { hexToRgb, withOpacity } from '@/features/insights/utils/color';

interface WeeklyBarChartProps {
  weeklyActivity: Array<{ week: number; reads: number; favorites: number; shares: number }>;
}

const BAR_WIDTH = 48;
const BAR_GAP = 16;
const MAX_BAR_HEIGHT = 100;
const CANVAS_HEIGHT = 120;

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ weeklyActivity }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { bars, canvasWidth } = useMemo(() => {
    const maxReads = Math.max(...weeklyActivity.map((w) => w.reads), 1);

    const bars = weeklyActivity.map((w, index) => {
      const normalizedHeight = (w.reads / maxReads) * MAX_BAR_HEIGHT;
      const barHeight = Math.max(normalizedHeight, 4);
      const opacity = 0.3 + (w.reads / maxReads) * 0.6;
      const x = index * (BAR_WIDTH + BAR_GAP);
      const y = CANVAS_HEIGHT - barHeight;

      return { ...w, barHeight, opacity, x, y };
    });

    const width = weeklyActivity.length * (BAR_WIDTH + BAR_GAP) - BAR_GAP;

    return { bars, canvasWidth: Math.max(width, BAR_WIDTH) };
  }, [weeklyActivity]);

  const rgb = useMemo(() => hexToRgb(colors.primary), [colors.primary]);

  return (
    <View className="rounded-xl bg-card p-3.5">
      <Text variant="headingSmall" bold className="mb-3 text-foreground">
        {t('insights.weeklyActivity')}
      </Text>

      <Canvas style={{ width: canvasWidth, height: CANVAS_HEIGHT }}>
        {bars.map((bar) => (
          <RoundedRect
            key={bar.week}
            x={bar.x}
            y={bar.y}
            width={BAR_WIDTH}
            height={bar.barHeight}
            r={6}
            color={withOpacity(rgb, bar.opacity)}
          />
        ))}
      </Canvas>

      {/* Week labels */}
      <View style={{ width: canvasWidth, flexDirection: 'row', marginTop: 6 }}>
        {bars.map((bar) => (
          <View
            key={bar.week}
            style={{
              width: BAR_WIDTH,
              marginRight: bar.week < weeklyActivity.length ? BAR_GAP : 0,
              alignItems: 'center',
            }}
          >
            <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
              {t('insights.week', { number: bar.week })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
