import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Portal } from 'react-native-portalize';
import { useTranslation } from 'react-i18next';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/lib/nativewind/theme.context';
import { haptics } from '@/shared/utils/haptics';
import type { InsightsResponse } from '@/features/insights/contracts/insights-service.contract';
import type { InsightsTab } from '@/features/insights/components/insights-tabs';
import { exportResumoCsv, exportProfundidadeCsv } from '@/features/insights/utils/export-csv';
import { exportPdf } from '@/features/insights/utils/export-pdf';

interface ExportBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  data: InsightsResponse;
  activeTab: InsightsTab;
  month: string;
}

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.4} />
);

export const ExportBottomSheet: React.FC<ExportBottomSheetProps> = ({ visible, onClose, data, activeTab, month }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleExportCsv = useCallback(async () => {
    haptics.medium();
    try {
      switch (activeTab) {
        case 'resumo':
          await exportResumoCsv(data, month);
          break;
        case 'profundidade':
          await exportProfundidadeCsv(data, month);
          break;
        case 'tendencias':
        default:
          await exportResumoCsv(data, month);
          break;
      }
    } catch {
      // User cancelled or error
    }
    onClose();
  }, [activeTab, data, month, onClose]);

  const handleExportPdf = useCallback(async () => {
    haptics.medium();
    try {
      await exportPdf(data, month);
    } catch {
      // User cancelled or error
    }
    onClose();
  }, [data, month, onClose]);

  if (!visible) return null;

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['35%']}
        onClose={onClose}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8 }}>
          <Text variant="headingSmall" className="mb-6 text-center text-foreground">
            {t('insights.exportTitle')}
          </Text>

          <View className="gap-3">
            <Button title={t('insights.exportCsv')} onPress={handleExportCsv} />
            <Button title={t('insights.exportPdf')} variant="outline" onPress={handleExportPdf} />
            <Button title={t('common.cancel')} variant="ghost" onPress={onClose} />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
};
