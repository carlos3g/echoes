import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { KpiCards } from '@/features/insights/components/kpi-cards';
import { HeatmapCalendar } from '@/features/insights/components/heatmap-calendar';
import { ActivityAreaChart } from '@/features/insights/components/activity-area-chart';
import { WeeklyBarChart } from '@/features/insights/components/weekly-bar-chart';
import { DonutChart } from '@/features/insights/components/donut-chart';
import { TopAuthorsList } from '@/features/insights/components/top-authors-list';
import { ReadingProfileRadar } from '@/features/insights/components/reading-profile-radar';
import { useGetInsights } from '@/features/insights/hooks/use-get-insights';
import { Text } from '@/shared/components/ui/text';

const CATEGORY_COLORS = [
  'rgba(139, 168, 144, 0.8)',
  'rgba(182, 159, 132, 0.7)',
  'rgba(200, 180, 160, 0.6)',
  'rgba(160, 160, 160, 0.4)',
];

const PLATFORM_COLORS = ['rgba(139, 168, 144, 0.8)', 'rgba(182, 159, 132, 0.7)', 'rgba(170, 140, 120, 0.5)'];

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function navigateMonth(month: string, direction: -1 | 1): string {
  const [year, m] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, m - 1 + direction, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function formatMonthLabel(month: string): string {
  const [year, m] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, m - 1, 1));
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

export default function InsightsScreen() {
  const { t } = useTranslation();
  const [month, setMonth] = useState(getCurrentMonth);
  const currentMonth = useMemo(() => getCurrentMonth(), []);
  const isCurrentMonth = month === currentMonth;

  const { data, isLoading, isError, refetch } = useGetInsights({ month });

  const handlePrev = () => setMonth((m) => navigateMonth(m, -1));
  const handleNext = () => {
    if (!isCurrentMonth) {
      setMonth((m) => navigateMonth(m, 1));
    }
  };

  const monthNav = (
    <View className="flex-row items-center justify-between px-4 py-3">
      <TouchableOpacity onPress={handlePrev} className="px-2 py-1">
        <Text variant="paragraphMedium" className="text-foreground">
          ←
        </Text>
      </TouchableOpacity>

      <View className="rounded-full bg-card px-4 py-1.5">
        <Text variant="paragraphSmall" bold className="text-foreground">
          {formatMonthLabel(month)}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleNext}
        disabled={isCurrentMonth}
        className="px-2 py-1"
        style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
      >
        <Text variant="paragraphMedium" className="text-foreground">
          →
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background">
        {monthNav}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 bg-background">
        {monthNav}
        <View className="flex-1 items-center justify-center gap-4 px-8">
          <Text variant="paragraphMedium" className="text-center text-muted-foreground">
            {t('error.description')}
          </Text>
          <TouchableOpacity onPress={() => refetch()} className="rounded-xl bg-card px-6 py-3">
            <Text variant="paragraphSmall" bold className="text-foreground">
              {t('error.retry')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-10">
      {monthNav}

      <View className="gap-4 px-4">
        <KpiCards summary={data.summary} />

        <HeatmapCalendar heatmap={data.heatmap} month={month} />

        <ActivityAreaChart dailyActivity={data.dailyActivity} />

        <WeeklyBarChart weeklyActivity={data.weeklyActivity} />

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

        <TopAuthorsList topAuthors={data.topAuthors} />

        <ReadingProfileRadar readingProfile={data.readingProfile} />
      </View>
    </ScrollView>
  );
}
