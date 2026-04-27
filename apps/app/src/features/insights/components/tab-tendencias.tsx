import React from 'react';
import { View } from 'react-native';
import type { InsightsResponse } from '@/features/insights/contracts/insights-service.contract';
import { StreakCard } from '@/features/insights/components/streak-card';
import { AnnualEvolutionChart } from '@/features/insights/components/annual-evolution-chart';
import { DiversityTrendChart } from '@/features/insights/components/diversity-trend-chart';
import { MonthComparison } from '@/features/insights/components/month-comparison';

interface TabTendenciasProps {
  data: InsightsResponse;
  month: string;
}

export const TabTendencias: React.FC<TabTendenciasProps> = ({ data, month }) => {
  const year = month.split('-')[0];

  return (
    <View className="gap-4 px-4 pt-4">
      <StreakCard current={data.streak.current} record={data.streak.record} />
      <AnnualEvolutionChart initialYear={year} />
      <DiversityTrendChart year={year} />
      <MonthComparison currentMonth={month} />
    </View>
  );
};
