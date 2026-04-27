import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Canvas, Circle } from '@shopify/react-native-skia';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { hexToRgb, withOpacity } from '@/features/insights/utils/color';

interface AuthorBubbleMapProps {
  authorBubbles: Array<{ uuid: string; name: string; quotesRead: number; engagementRate: number }>;
}

const SIZE = 280;
const MIN_RADIUS = 12;
const MAX_RADIUS = 40;

interface PositionedBubble {
  x: number;
  y: number;
  r: number;
  name: string;
  quotesRead: number;
  engagementRate: number;
}

function packBubbles(
  bubbles: Array<{ name: string; quotesRead: number; engagementRate: number; r: number }>
): PositionedBubble[] {
  const center = SIZE / 2;
  const placed: PositionedBubble[] = [];

  const sorted = [...bubbles].sort((a, b) => b.r - a.r);

  for (const bubble of sorted) {
    if (placed.length === 0) {
      placed.push({ ...bubble, x: center, y: center });
      continue;
    }

    let bestX = center;
    let bestY = center;
    let bestDist = Infinity;

    for (let angle = 0; angle < 360; angle += 15) {
      for (let dist = 0; dist < SIZE / 2; dist += 5) {
        const x = center + dist * Math.cos((angle * Math.PI) / 180);
        const y = center + dist * Math.sin((angle * Math.PI) / 180);

        const overlaps = placed.some((p) => {
          const d = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
          return d < p.r + bubble.r + 2;
        });

        if (!overlaps && x - bubble.r > 0 && x + bubble.r < SIZE && y - bubble.r > 0 && y + bubble.r < SIZE) {
          if (dist < bestDist) {
            bestDist = dist;
            bestX = x;
            bestY = y;
          }
          break;
        }
      }
    }

    placed.push({ ...bubble, x: bestX, y: bestY });
  }

  return placed;
}

export const AuthorBubbleMap: React.FC<AuthorBubbleMapProps> = ({ authorBubbles }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const primaryRgb = hexToRgb(colors.primary);

  const positioned = useMemo(() => {
    if (authorBubbles.length === 0) return [];

    const maxReads = Math.max(...authorBubbles.map((a) => a.quotesRead));
    const withRadius = authorBubbles.map((a) => ({
      ...a,
      r: MIN_RADIUS + (a.quotesRead / maxReads) * (MAX_RADIUS - MIN_RADIUS),
    }));

    return packBubbles(withRadius);
  }, [authorBubbles]);

  if (authorBubbles.length === 0) return null;

  return (
    <Animated.View entering={FadeInUp.delay(300).duration(400)} className="rounded-2xl bg-card p-4">
      <Text variant="paragraphSmall" bold className="mb-3 text-muted-foreground">
        {t('insights.authorBubbles')}
      </Text>

      <View style={{ alignItems: 'center' }}>
        <Canvas
          style={{ width: SIZE, height: SIZE }}
          accessibilityLabel={
            t('insights.authorBubbles') + ': ' + authorBubbles.map((a) => a.name + ' ' + a.quotesRead).join(', ')
          }
        >
          {positioned.map((b, i) => (
            <Circle key={i} cx={b.x} cy={b.y} r={b.r} color={withOpacity(primaryRgb, 0.2 + b.engagementRate * 0.7)} />
          ))}
        </Canvas>

        <View className="mt-2 flex-row flex-wrap justify-center gap-2">
          {positioned.slice(0, 6).map((b, i) => (
            <View key={i} className="flex-row items-center gap-1">
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: withOpacity(primaryRgb, 0.2 + b.engagementRate * 0.7),
                }}
              />
              <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
                {b.name} ({b.quotesRead})
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};
