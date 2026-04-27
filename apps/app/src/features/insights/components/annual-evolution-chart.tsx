import React, { useMemo, useState } from 'react';
import { View, Pressable, Text as RNText } from 'react-native';
import { Canvas, Path, Circle } from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { useGetAnnualInsights } from '@/features/insights/hooks/use-get-annual-insights';
import { SAGE_RGBA, CLAY_RGBA, GRAY_RGBA, MONTH_LABELS } from '@/features/insights/constants/colors';

interface AnnualEvolutionChartProps {
  initialYear: string;
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 140;
const PADDING = { top: 12, right: 12, bottom: 24, left: 12 };

export const AnnualEvolutionChart: React.FC<AnnualEvolutionChartProps> = ({ initialYear }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [year, setYear] = useState(initialYear);

  const currentYear = new Date().getFullYear().toString();
  const canGoForward = year < currentYear;

  const { data, isLoading } = useGetAnnualInsights({ year });

  const { readsPath, favsPath, sharesPath, readsPoints, favsPoints, sharesPoints, xPositions } = useMemo(() => {
    const empty = {
      readsPath: '',
      favsPath: '',
      sharesPath: '',
      readsPoints: [],
      favsPoints: [],
      sharesPoints: [],
      xPositions: [] as number[],
    };
    if (!data?.months?.length) return empty;

    const months = data.months;
    const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const maxValue = Math.max(...months.map((m) => Math.max(m.reads, m.favorites, m.shares)), 1);

    const xScale = scaleLinear()
      .domain([0, 11])
      .range([PADDING.left, PADDING.left + innerWidth]);

    const yScale = scaleLinear()
      .domain([0, maxValue])
      .range([PADDING.top + innerHeight, PADDING.top]);

    const makeLineGen = (accessor: (d: (typeof months)[0]) => number) =>
      line<(typeof months)[0]>()
        .x((_, i) => xScale(i))
        .y((d) => yScale(accessor(d)))
        .curve(curveMonotoneX);

    const readsLine = makeLineGen((d) => d.reads);
    const favsLine = makeLineGen((d) => d.favorites);
    const sharesLine = makeLineGen((d) => d.shares);

    const toPoints = (accessor: (d: (typeof months)[0]) => number) =>
      months.map((d, i) => ({ x: xScale(i), y: yScale(accessor(d)) }));

    return {
      readsPath: readsLine(months) ?? '',
      favsPath: favsLine(months) ?? '',
      sharesPath: sharesLine(months) ?? '',
      readsPoints: toPoints((d) => d.reads),
      favsPoints: toPoints((d) => d.favorites),
      sharesPoints: toPoints((d) => d.shares),
      xPositions: months.map((_, i) => xScale(i)),
    };
  }, [data]);

  const navigateYear = (direction: number) => {
    const next = (parseInt(year, 10) + direction).toString();
    if (direction > 0 && next > currentYear) return;
    setYear(next);
  };

  return (
    <Animated.View entering={FadeInUp.delay(80).duration(400).springify()} className="rounded-xl bg-card p-3.5">
      {/* Header with year navigation */}
      <View className="mb-3 flex-row items-center justify-between">
        <Text variant="headingSmall" bold className="text-foreground">
          {t('insights.annualEvolution')}
        </Text>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => navigateYear(-1)}
            accessibilityLabel={t('insights.annualEvolution') + ': ' + t('common.previous')}
            accessibilityRole="button"
            style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
          >
            <RNText style={{ fontSize: 18, color: colors.foreground }}>{'<'}</RNText>
          </Pressable>
          <RNText style={{ fontFamily: 'DMSans-SemiBold', fontSize: 14, color: colors.foreground }}>{year}</RNText>
          <Pressable
            onPress={() => navigateYear(1)}
            disabled={!canGoForward}
            accessibilityLabel={t('insights.annualEvolution') + ': ' + t('common.next')}
            accessibilityRole="button"
            style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
          >
            <RNText
              style={{
                fontSize: 18,
                color: canGoForward ? colors.foreground : colors.mutedForeground,
                opacity: canGoForward ? 1 : 0.4,
              }}
            >
              {'>'}
            </RNText>
          </Pressable>
        </View>
      </View>

      {/* Legend */}
      <View className="mb-2 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1.5">
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: SAGE_RGBA }} />
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {t('insights.reads')}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: CLAY_RGBA }} />
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {t('insights.favorites')}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: GRAY_RGBA }} />
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {t('insights.shares')}
          </Text>
        </View>
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
            accessibilityLabel={t('insights.annualEvolution') + ' ' + year}
          >
            {readsPath ? <Path path={readsPath} color={SAGE_RGBA} style="stroke" strokeWidth={2} /> : null}
            {favsPath ? <Path path={favsPath} color={CLAY_RGBA} style="stroke" strokeWidth={2} /> : null}
            {sharesPath ? <Path path={sharesPath} color={GRAY_RGBA} style="stroke" strokeWidth={2} /> : null}

            {readsPoints.map((p, i) => (
              <Circle key={`r-${i}`} cx={p.x} cy={p.y} r={3} color={SAGE_RGBA} />
            ))}
            {favsPoints.map((p, i) => (
              <Circle key={`f-${i}`} cx={p.x} cy={p.y} r={3} color={CLAY_RGBA} />
            ))}
            {sharesPoints.map((p, i) => (
              <Circle key={`s-${i}`} cx={p.x} cy={p.y} r={3} color={GRAY_RGBA} />
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
