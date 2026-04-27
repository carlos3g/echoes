import React from 'react';
import { View, Text as RNText } from 'react-native';
import { Canvas, RoundedRect } from '@shopify/react-native-skia';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { hexToRgb, withOpacity } from '@/features/insights/utils/color';

interface SessionMetricsProps {
  sessions: {
    avgDuration: number;
    avgQuotes: number;
    total: number;
    distribution: { under1: number; from1to5: number; from5to15: number; over15: number };
  };
}

function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}m${s > 0 ? `${s}s` : ''}` : `${s}s`;
}

const DIST_LABELS = ['<1m', '1-5m', '5-15m', '15m+'];
const DIST_KEYS = ['under1', 'from1to5', 'from5to15', 'over15'] as const;

const BAR_W = 48;
const BAR_GAP = 12;
const MAX_BAR_H = 60;

export const SessionMetrics: React.FC<SessionMetricsProps> = ({ sessions }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const primaryRgb = hexToRgb(colors.primary);

  const maxDist = Math.max(1, ...DIST_KEYS.map((k) => sessions.distribution[k]));
  const totalW = DIST_KEYS.length * BAR_W + (DIST_KEYS.length - 1) * BAR_GAP;

  if (sessions.total === 0) {
    return (
      <Animated.View entering={FadeInUp.delay(100).duration(400)} className="rounded-2xl bg-card p-4">
        <Text variant="paragraphSmall" bold className="mb-3 text-muted-foreground">
          {t('insights.sessionMetrics')}
        </Text>
        <Text variant="paragraphCaptionSmall" className="text-center text-muted-foreground">
          {t('insights.noDataYet')}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.delay(100).duration(400)} className="rounded-2xl bg-card p-4">
      <Text variant="paragraphSmall" bold className="mb-3 text-muted-foreground">
        {t('insights.sessionMetrics')}
      </Text>

      <View className="mb-4 flex-row gap-2">
        {[
          { label: t('insights.avgDuration'), value: formatDuration(sessions.avgDuration) },
          { label: t('insights.quotesPerSession'), value: sessions.avgQuotes.toFixed(1) },
          { label: t('insights.totalSessions'), value: String(sessions.total) },
        ].map((stat, i) => (
          <Animated.View
            key={stat.label}
            entering={FadeInUp.delay(i * 80)
              .duration(400)
              .springify()}
            className="flex-1 items-center rounded-xl bg-muted py-3"
          >
            <RNText style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: colors.foreground }}>
              {stat.value}
            </RNText>
            <Text variant="paragraphCaptionSmall" className="text-muted-foreground">
              {stat.label}
            </Text>
          </Animated.View>
        ))}
      </View>

      <Canvas
        style={{ width: totalW, height: MAX_BAR_H, alignSelf: 'center' }}
        accessibilityLabel={
          t('insights.sessionMetrics') +
          ': ' +
          DIST_LABELS.map((label, i) => label + ' ' + sessions.distribution[DIST_KEYS[i]]).join(', ')
        }
      >
        {DIST_KEYS.map((key, i) => {
          const val = sessions.distribution[key];
          const h = Math.max(4, (val / maxDist) * MAX_BAR_H);
          const opacity = 0.3 + (val / maxDist) * 0.6;
          return (
            <RoundedRect
              key={key}
              x={i * (BAR_W + BAR_GAP)}
              y={MAX_BAR_H - h}
              width={BAR_W}
              height={h}
              r={6}
              color={withOpacity(primaryRgb, opacity)}
            />
          );
        })}
      </Canvas>

      <View className="mt-1 flex-row justify-around" style={{ width: totalW, alignSelf: 'center' }}>
        {DIST_LABELS.map((label) => (
          <RNText
            key={label}
            style={{
              width: BAR_W,
              textAlign: 'center',
              fontSize: 10,
              fontFamily: 'DMSans-Regular',
              color: colors.mutedForeground,
            }}
          >
            {label}
          </RNText>
        ))}
      </View>
    </Animated.View>
  );
};
