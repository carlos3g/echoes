import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { InsightsTabs, type InsightsTab } from '@/features/insights/components/insights-tabs';
import { TabResumo } from '@/features/insights/components/tab-resumo';
import { TabTendencias } from '@/features/insights/components/tab-tendencias';
import { TabProfundidade } from '@/features/insights/components/tab-profundidade';
import { ExportBottomSheet } from '@/features/insights/components/export-bottom-sheet';
import { useGetInsights } from '@/features/insights/hooks/use-get-insights';
import { getCurrentMonth, navigateMonth, formatMonthLabel } from '@/features/insights/utils/date';
import { Text } from '@/shared/components/ui/text';

export default function InsightsScreen() {
  const { t } = useTranslation();
  const [month, setMonth] = useState(getCurrentMonth);
  const [activeTab, setActiveTab] = useState<InsightsTab>('resumo');
  const [exportVisible, setExportVisible] = useState(false);
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

      <View className="flex-row items-center gap-2">
        <TouchableOpacity onPress={() => setExportVisible(true)} className="px-2 py-1">
          <Text variant="paragraphSmall" className="text-primary">
            {t('insights.export')}
          </Text>
        </TouchableOpacity>
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
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumo':
        return <TabResumo data={data!} month={month} />;
      case 'tendencias':
        return <TabTendencias data={data!} month={month} />;
      case 'profundidade':
        return <TabProfundidade data={data!} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-background">
      {monthNav}
      <InsightsTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : isError || !data ? (
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
      ) : (
        <>
          <ScrollView className="flex-1" contentContainerClassName="pb-10">
            {renderTabContent()}
          </ScrollView>
          <ExportBottomSheet
            visible={exportVisible}
            onClose={() => setExportVisible(false)}
            data={data}
            activeTab={activeTab}
            month={month}
          />
        </>
      )}
    </View>
  );
}
