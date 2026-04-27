import React, { useMemo } from 'react';
import { View, Text as RNText } from 'react-native';
import { Canvas, Path, Circle } from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { useGetAnnualInsights } from '@/features/insights/hooks/use-get-annual-insights';
import { SAGE_RGBA, MONTH_LABELS } from '@/features/insights/constants/colors';

interface DiversityTrendChartProps {
  year: string;
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 100;
const PADDING = { top: 8, right: 12, bottom: 24, left: 12 };

export const DiversityTrendChart: React.FC<DiversityTrendChartProps> = ({ year }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { data, isLoading } = useGetAnnualInsights({ year });

  const currentScore = useMemo(() => {
    if (!data?.months?.length) return 0;
    const now = new Date();
    const currentMonthIndex = year === now.getFullYear().toString() ? now.getMonth() : 11;
    return data.months[currentMonthIndex]?.diversityScore ?? 0;
  }, [data, year]);

  const { linePath, points, xPositions } = useMemo(() => {
    const empty = { linePath: '', points: [] as Array<{ x: number; y: number }>, xPositions: [] as number[] };
    if (!data?.months?.length) return empty;

    const months = data.months;
    const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const xScale = scaleLinear()
      .domain([0, 11])
      .range([PADDING.left, PADDING.left + innerWidth]);

    const yScale = scaleLinear()
      .domain([0, 100])
      .range([PADDING.top + innerHeight, PADDING.top]);

    const lineGen = line<(typeof months)[0]>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d.diversityScore))
      .curve(curveMonotoneX);

    return {
      linePath: lineGen(months) ?? '',
      points: months.map((d, i) => ({ x: xScale(i), y: yScale(d.diversityScore) })),
      xPositions: months.map((_, i) => xScale(i)),
    };
  }, [data]);

  return (
    <Animated.View entering={FadeInUp.delay(160).duration(400).springify()} className="rounded-xl bg-card p-3.5">
      <View className="mb-3 flex-row items-center justify-between">
        <Text variant="headingSmall" bold className="text-foreground">
          {t('insights.diversityIndex')}
        </Text>
        <RNText style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: colors.foreground }}>
          {currentScore}
        </RNText>
      </View>

      {isLoading ? (
        <View style={{ width: CHART_WIDTH, height: CHART_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            ...
          </Text>
        </View>
      ) : (
        <>
          <Canvas
            style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}
            accessibilityLabel={t('insights.diversityIndex') + ' ' + year + ': ' + currentScore}
          >
            {linePath ? <Path path={linePath} color={SAGE_RGBA} style="stroke" strokeWidth={2} /> : null}
            {points.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r={3} color={SAGE_RGBA} />
            ))}
          </Canvas>

          {/* Month labels */}
          <View style={{ width: CHART_WIDTH, position: 'relative', height: 16 }}>
            {xPositions.map((x, i) => (
              <RNText
                key={i}
                style={{
                  position: 'absolute',
                  left: x - 4,
                  fontSize: 10,
                  color: '#9B8E7E',
                }}
              >
                {MONTH_LABELS[i]}
              </RNText>
            ))}
          </View>
        </>
      )}
    </Animated.View>
  );
};
