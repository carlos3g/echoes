import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { hexToRgb, withOpacity } from '@/features/insights/utils/color';

interface HeatmapCalendarProps {
  heatmap: Array<{ date: string; intensity: number }>;
  month: string;
}

const CELL_SIZE = 36;
const GAP = 4;
const COLUMNS = 7;
const DAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const INTENSITY_OPACITIES = [0.08, 0.3, 0.55, 0.85];

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ heatmap, month }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { cells, canvasWidth, canvasHeight } = useMemo(() => {
    const firstDayOfMonth = new Date(`${month}-01`);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

    const paddedCells: Array<{ date: string | null; intensity: number }> = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      paddedCells.push({ date: null, intensity: 0 });
    }

    heatmap.forEach((h) => {
      paddedCells.push({ date: h.date, intensity: h.intensity });
    });

    const rows = Math.ceil(paddedCells.length / COLUMNS);
    const width = COLUMNS * CELL_SIZE + (COLUMNS - 1) * GAP;
    const height = rows * CELL_SIZE + (rows - 1) * GAP;

    return { cells: paddedCells, canvasWidth: width, canvasHeight: height };
  }, [heatmap, month]);

  const rgb = useMemo(() => hexToRgb(colors.primary), [colors.primary]);

  const legendCellSize = 14;

  return (
    <View className="rounded-xl bg-card p-3.5">
      <Text variant="headingSmall" bold className="mb-3 text-foreground">
        {t('insights.daysActive')}
      </Text>

      {/* Day labels row */}
      <View className="mb-1 flex-row" style={{ gap: GAP }}>
        {DAY_LABELS.map((label, idx) => (
          <View key={idx} style={{ width: CELL_SIZE, alignItems: 'center' }}>
            <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
              {label}
            </Text>
          </View>
        ))}
      </View>

      {/* Heatmap canvas */}
      <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
        {cells.map((cell, index) => {
          const col = index % COLUMNS;
          const row = Math.floor(index / COLUMNS);
          const x = col * (CELL_SIZE + GAP);
          const y = row * (CELL_SIZE + GAP);

          if (!cell.date) {
            return (
              <RoundedRect
                key={`empty-${index}`}
                x={x}
                y={y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                r={6}
                color={withOpacity(rgb, 0.04)}
              />
            );
          }

          const intensityIndex = Math.min(Math.max(cell.intensity - 1, 0), INTENSITY_OPACITIES.length - 1);
          const opacity = cell.intensity === 0 ? INTENSITY_OPACITIES[0] : INTENSITY_OPACITIES[intensityIndex];

          return (
            <RoundedRect
              key={cell.date}
              x={x}
              y={y}
              width={CELL_SIZE}
              height={CELL_SIZE}
              r={6}
              color={withOpacity(rgb, opacity)}
            />
          );
        })}
      </Canvas>

      {/* Legend */}
      <View className="mt-3 flex-row items-center gap-2">
        <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
          {t('insights.less')}
        </Text>
        {INTENSITY_OPACITIES.map((op, idx) => (
          <Canvas key={idx} style={{ width: legendCellSize, height: legendCellSize }}>
            <RoundedRect
              x={0}
              y={0}
              width={legendCellSize}
              height={legendCellSize}
              r={3}
              color={withOpacity(rgb, op)}
            />
          </Canvas>
        ))}
        <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
          {t('insights.more')}
        </Text>
      </View>
    </View>
  );
};
