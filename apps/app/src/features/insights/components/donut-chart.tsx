import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Canvas, Path } from '@shopify/react-native-skia';
import { pie, arc } from 'd3-shape';
import { Text } from '@/shared/components/ui/text';

interface DonutChartProps {
  title: string;
  data: Array<{ label: string; value: number }>;
  colors: string[];
  size?: number;
}

const STROKE_WIDTH = 10;

export const DonutChart: React.FC<DonutChartProps> = ({ title, data, colors, size = 80 }) => {
  const center = size / 2;
  const outerRadius = center - STROKE_WIDTH / 2;
  const innerRadius = outerRadius - STROKE_WIDTH;

  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  const arcs = useMemo(() => {
    if (!data.length || total === 0) return [];

    const pieGen = pie<{ label: string; value: number }>().value((d) => d.value);
    const arcGen = arc<{ startAngle: number; endAngle: number }>().innerRadius(innerRadius).outerRadius(outerRadius);

    const pieData = pieGen(data);

    return pieData.map((slice, index) => ({
      path: arcGen({ startAngle: slice.startAngle, endAngle: slice.endAngle }) ?? '',
      color: colors[index % colors.length],
      label: slice.data.label,
      value: slice.data.value,
    }));
  }, [data, total, innerRadius, outerRadius, colors]);

  return (
    <View className="flex-1 rounded-xl bg-card p-3.5">
      <Text variant="paragraphSmall" className="mb-3 text-center text-muted-foreground">
        {title}
      </Text>

      <View className="items-center">
        <Canvas
          style={{ width: size, height: size }}
          accessibilityLabel={
            title +
            ': ' +
            arcs.map((s) => s.label + ' ' + (total > 0 ? Math.round((s.value / total) * 100) : 0) + '%').join(', ')
          }
        >
          {arcs.map((segment, index) =>
            segment.path ? (
              <Path
                key={index}
                path={segment.path}
                color={segment.color}
                style="fill"
                transform={[{ translateX: center }, { translateY: center }]}
              />
            ) : null
          )}
        </Canvas>
      </View>

      <View className="mt-3 gap-1.5">
        {arcs.map((segment, index) => {
          const percentage = total > 0 ? Math.round((segment.value / total) * 100) : 0;
          return (
            <View key={index} className="flex-row items-center gap-2">
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: segment.color,
                }}
              />
              <Text variant="paragraphCaptionSmall" className="flex-1 text-foreground">
                {segment.label}
              </Text>
              <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
                {percentage}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
