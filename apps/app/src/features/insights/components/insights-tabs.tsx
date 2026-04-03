import React from 'react';
import { TouchableOpacity, View, Text as RNText } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

export type InsightsTab = 'resumo' | 'tendencias' | 'profundidade';

interface InsightsTabsProps {
  activeTab: InsightsTab;
  onChangeTab: (tab: InsightsTab) => void;
}

const TABS: Array<{ key: InsightsTab; labelKey: string }> = [
  { key: 'resumo', labelKey: 'insights.tabs.resumo' },
  { key: 'tendencias', labelKey: 'insights.tabs.tendencias' },
  { key: 'profundidade', labelKey: 'insights.tabs.profundidade' },
];

export const InsightsTabs: React.FC<InsightsTabsProps> = ({ activeTab, onChangeTab }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View className="flex-row border-b border-border" accessibilityRole="tablist">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onChangeTab(tab.key)}
            className="flex-1 items-center py-3"
            style={{ minHeight: 44 }}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={t(tab.labelKey)}
          >
            <RNText
              style={{
                fontSize: 13,
                fontFamily: isActive ? 'DMSans-Bold' : 'DMSans-Regular',
                color: isActive ? colors.primary : colors.mutedForeground,
              }}
            >
              {t(tab.labelKey)}
            </RNText>
            {isActive && (
              <View className="absolute bottom-0 h-0.5 w-full" style={{ backgroundColor: colors.primary }} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
