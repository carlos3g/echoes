import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Canvas, Path, Circle } from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { hexToRgb, withOpacity } from '@/features/insights/utils/color';

interface ReadingProfileRadarProps {
  readingProfile: {
    exploration: number;
    collection: number;
    sharing: number;
    consistency: number;
    depth: number;
  };
}

const CANVAS_SIZE = 200;
const CENTER = 100;
const MAX_RADIUS = 70;
const DIMENSIONS = ['exploration', 'collection', 'sharing', 'consistency', 'depth'] as const;
const NUM_SIDES = 5;

function polarToCartesian(angleDeg: number, radius: number): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER + radius * Math.sin(angleRad),
  };
}

function getGridPath(level: number): string {
  const radius = (level / 3) * MAX_RADIUS;
  const points = DIMENSIONS.map((_, i) => {
    const angle = (i / NUM_SIDES) * 360;
    return polarToCartesian(angle, radius);
  });
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';
}

function getPolygonPath(values: number[]): string {
  const points = values.map((value, i) => {
    const angle = (i / NUM_SIDES) * 360;
    const radius = (value / 100) * MAX_RADIUS;
    return polarToCartesian(angle, radius);
  });
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';
}

const GRID_LEVELS = [1, 2, 3];

export const ReadingProfileRadar: React.FC<ReadingProfileRadarProps> = ({ readingProfile }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const rgb = hexToRgb(colors.primary);

  const { dataPolygonPath, gridPaths, axisLines, labelPositions } = useMemo(() => {
    const values = DIMENSIONS.map((dim) => readingProfile[dim]);

    const dataPolygonPath = getPolygonPath(values);
    const gridPaths = GRID_LEVELS.map((level) => getGridPath(level));

    const axisLines = DIMENSIONS.map((_, i) => {
      const angle = (i / NUM_SIDES) * 360;
      const outer = polarToCartesian(angle, MAX_RADIUS);
      return { x1: CENTER, y1: CENTER, x2: outer.x, y2: outer.y };
    });

    const LABEL_RADIUS = MAX_RADIUS + 20;
    const labelPositions = DIMENSIONS.map((dim, i) => {
      const angle = (i / NUM_SIDES) * 360;
      const pos = polarToCartesian(angle, LABEL_RADIUS);
      return { dim, value: readingProfile[dim], x: pos.x, y: pos.y };
    });

    return { dataPolygonPath, gridPaths, axisLines, labelPositions };
  }, [readingProfile]);

  return (
    <View>
      <Text variant="headingSmall" bold className="mb-3 text-foreground">
        {t('insights.readingProfile')}
      </Text>

      <View className="rounded-xl bg-card p-3.5">
        <View className="items-center">
          <View style={{ width: CANVAS_SIZE, height: CANVAS_SIZE, position: 'relative' }}>
            <Canvas style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
              {/* Grid pentagons */}
              {gridPaths.map((path, index) => (
                <Path key={`grid-${index}`} path={path} color="rgba(0, 0, 0, 0.05)" style="stroke" strokeWidth={1} />
              ))}

              {/* Axis lines */}
              {axisLines.map((line, index) => (
                <Path
                  key={`axis-${index}`}
                  path={`M ${line.x1},${line.y1} L ${line.x2},${line.y2}`}
                  color="rgba(0, 0, 0, 0.04)"
                  style="stroke"
                  strokeWidth={1}
                />
              ))}

              {/* Data polygon fill */}
              <Path path={dataPolygonPath} color={withOpacity(rgb, 0.2)} style="fill" />

              {/* Data polygon stroke */}
              <Path path={dataPolygonPath} color={withOpacity(rgb, 0.7)} style="stroke" strokeWidth={1.5} />

              {/* Data points */}
              {DIMENSIONS.map((dim, i) => {
                const angle = (i / NUM_SIDES) * 360;
                const radius = (readingProfile[dim] / 100) * MAX_RADIUS;
                const pos = polarToCartesian(angle, radius);
                return <Circle key={`point-${dim}`} cx={pos.x} cy={pos.y} r={3} color={withOpacity(rgb, 0.9)} />;
              })}
            </Canvas>

            {/* Labels rendered outside canvas as RN Text */}
            {labelPositions.map(({ dim, value, x, y }) => (
              <View
                key={dim}
                style={{
                  position: 'absolute',
                  left: x - 40,
                  top: y - 10,
                  width: 80,
                  alignItems: 'center',
                }}
                pointerEvents="none"
              >
                <Text variant="paragraphCaptionSmall" className="text-center text-muted-foreground">
                  {t(`insights.${dim}`)}: {value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
