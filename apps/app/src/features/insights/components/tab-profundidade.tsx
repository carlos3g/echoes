import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HourlyHeatmap } from '@/features/insights/components/hourly-heatmap';
import { SessionMetrics } from '@/features/insights/components/session-metrics';
import { RereadRateCard } from '@/features/insights/components/reread-rate-card';
import { AuthorBubbleMap } from '@/features/insights/components/author-bubble-map';
import { DonutChart } from '@/features/insights/components/donut-chart';
import { ReadingProfileRadar } from '@/features/insights/components/reading-profile-radar';
import type { InsightsResponse } from '@/features/insights/contracts/insights-service.contract';
import { CATEGORY_COLORS, PLATFORM_COLORS } from '@/features/insights/constants/colors';

interface TabProfundidadeProps {
  data: InsightsResponse;
}

export const TabProfundidade: React.FC<TabProfundidadeProps> = ({ data }) => {
  const { t } = useTranslation();

  return (
    <View className="gap-4 px-4 pt-4">
      <HourlyHeatmap hourlyHeatmap={data.hourlyHeatmap} />

      <SessionMetrics sessions={data.sessions} />

      <RereadRateCard rereadRate={data.rereadRate} />

      <AuthorBubbleMap authorBubbles={data.authorBubbles} />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <DonutChart
            title={t('insights.topCategories')}
            data={data.topCategories.map((c) => ({ label: c.title, value: c.count }))}
            colors={CATEGORY_COLORS}
          />
        </View>
        <View className="flex-1">
          <DonutChart
            title={t('insights.sharesByPlatform')}
            data={data.sharesByPlatform.map((s) => ({ label: s.platform, value: s.count }))}
            colors={PLATFORM_COLORS}
          />
        </View>
      </View>

      <ReadingProfileRadar readingProfile={data.readingProfile} />
    </View>
  );
};
