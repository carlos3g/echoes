import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Canvas, Path } from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { area, line, curveMonotoneX } from 'd3-shape';
import { scaleLinear } from 'd3-scale';
import { Text } from '@/shared/components/ui/text';
import { Text as RNText } from 'react-native';

interface ActivityAreaChartProps {
  dailyActivity: Array<{ date: string; reads: number; favorites: number; shares: number }>;
}

const CHART_WIDTH = 320;
const CHART_HEIGHT = 120;
const PADDING = { top: 8, right: 8, bottom: 24, left: 8 };

const SAGE = { r: 139, g: 168, b: 144 };
const CLAY = { r: 182, g: 159, b: 132 };

function rgba(r: number, g: number, b: number, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export const ActivityAreaChart: React.FC<ActivityAreaChartProps> = ({ dailyActivity }) => {
  const { t } = useTranslation();

  const { readsAreaPath, readLinePath, favAreaPath, favLinePath, xLabels } = useMemo(() => {
    if (!dailyActivity.length) {
      return { readsAreaPath: '', readLinePath: '', favAreaPath: '', favLinePath: '', xLabels: [] };
    }

    const innerWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const innerHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const maxValue = Math.max(...dailyActivity.map((d) => Math.max(d.reads, d.favorites)), 1);

    const xScale = scaleLinear()
      .domain([0, dailyActivity.length - 1])
      .range([PADDING.left, PADDING.left + innerWidth]);

    const yScale = scaleLinear()
      .domain([0, maxValue])
      .range([PADDING.top + innerHeight, PADDING.top]);

    const readsAreaGen = area<(typeof dailyActivity)[0]>()
      .x((_, i) => xScale(i))
      .y0(PADDING.top + innerHeight)
      .y1((d) => yScale(d.reads))
      .curve(curveMonotoneX);

    const readsLineGen = line<(typeof dailyActivity)[0]>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d.reads))
      .curve(curveMonotoneX);

    const favAreaGen = area<(typeof dailyActivity)[0]>()
      .x((_, i) => xScale(i))
      .y0(PADDING.top + innerHeight)
      .y1((d) => yScale(d.favorites))
      .curve(curveMonotoneX);

    const favLineGen = line<(typeof dailyActivity)[0]>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d.favorites))
      .curve(curveMonotoneX);

    const readsAreaPath = readsAreaGen(dailyActivity) ?? '';
    const readLinePath = readsLineGen(dailyActivity) ?? '';
    const favAreaPath = favAreaGen(dailyActivity) ?? '';
    const favLinePath = favLineGen(dailyActivity) ?? '';

    const lastIndex = dailyActivity.length - 1;
    const labelIndices = [0, 7, 14, 21, lastIndex].filter((i, pos, arr) => {
      if (i > lastIndex) return false;
      return arr.indexOf(i) === pos;
    });

    const xLabels = labelIndices.map((i) => ({
      x: xScale(i),
      label: new Date(dailyActivity[i].date).getDate().toString(),
    }));

    return { readsAreaPath, readLinePath, favAreaPath, favLinePath, xLabels };
  }, [dailyActivity]);

  return (
    <View className="rounded-xl bg-card p-3.5">
      <Text variant="headingSmall" bold className="mb-3 text-foreground">
        {t('insights.dailyActivity')}
      </Text>

      {/* Legend */}
      <View className="mb-2 flex-row items-center gap-4">
        <View className="flex-row items-center gap-1.5">
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: rgba(SAGE.r, SAGE.g, SAGE.b, 0.85),
            }}
          />
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {t('insights.reads')}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: rgba(CLAY.r, CLAY.g, CLAY.b, 0.85),
            }}
          />
          <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
            {t('insights.favorites')}
          </Text>
        </View>
      </View>

      <Canvas style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
        {/* Reads area fill */}
        {readsAreaPath ? <Path path={readsAreaPath} color={rgba(SAGE.r, SAGE.g, SAGE.b, 0.2)} style="fill" /> : null}
        {/* Reads area stroke */}
        {readLinePath ? (
          <Path path={readLinePath} color={rgba(SAGE.r, SAGE.g, SAGE.b, 0.7)} style="stroke" strokeWidth={1.5} />
        ) : null}
        {/* Favorites area fill */}
        {favAreaPath ? <Path path={favAreaPath} color={rgba(CLAY.r, CLAY.g, CLAY.b, 0.2)} style="fill" /> : null}
        {/* Favorites area stroke */}
        {favLinePath ? (
          <Path path={favLinePath} color={rgba(CLAY.r, CLAY.g, CLAY.b, 0.7)} style="stroke" strokeWidth={1.5} />
        ) : null}
      </Canvas>

      {/* X-axis labels */}
      <View style={{ width: CHART_WIDTH, position: 'relative', height: 16 }}>
        {xLabels.map(({ x, label }) => (
          <RNText
            key={label}
            style={{
              position: 'absolute',
              left: x - 8,
              fontSize: 10,
              color: '#9B8E7E',
            }}
          >
            {label}
          </RNText>
        ))}
      </View>
    </View>
  );
};
