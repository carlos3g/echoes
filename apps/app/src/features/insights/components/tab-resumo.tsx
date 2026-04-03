import React from 'react';
import { View } from 'react-native';
import { KpiCards } from '@/features/insights/components/kpi-cards';
import { HeatmapCalendar } from '@/features/insights/components/heatmap-calendar';
import { ActivityAreaChart } from '@/features/insights/components/activity-area-chart';
import { WeeklyBarChart } from '@/features/insights/components/weekly-bar-chart';
import { TopAuthorsList } from '@/features/insights/components/top-authors-list';
import type { InsightsResponse } from '@/features/insights/contracts/insights-service.contract';

interface TabResumoProps {
  data: InsightsResponse;
  month: string;
}

export const TabResumo: React.FC<TabResumoProps> = ({ data, month }) => {
  return (
    <View className="gap-4 px-4 pt-4">
      <KpiCards summary={data.summary} />
      <HeatmapCalendar heatmap={data.heatmap} month={month} />
      <ActivityAreaChart dailyActivity={data.dailyActivity} />
      <WeeklyBarChart weeklyActivity={data.weeklyActivity} />
      <TopAuthorsList topAuthors={data.topAuthors} />
    </View>
  );
};
