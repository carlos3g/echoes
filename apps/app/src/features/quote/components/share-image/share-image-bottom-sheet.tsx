import React, { useCallback, useRef, useState } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Portal } from 'react-native-portalize';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { useTranslation } from 'react-i18next';
import type { Quote } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/lib/nativewind/theme.context';
import { haptics } from '@/shared/utils/haptics';
import { useShareQuote } from '@/features/quote/hooks/use-share-quote';
import { ShareImageTemplate } from './share-image-template';
import { SharePreview } from './share-preview';
import { shareTemplates } from './share-templates';
import type { ShareTemplate } from './share-templates';

interface ShareImageBottomSheetProps {
  data: Quote | null;
  onClose: () => void;
}

const renderBackdrop = (props: any) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.4} />
);

export const ShareImageBottomSheet: React.FC<ShareImageBottomSheetProps> = ({ data, onClose }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const captureRef_ = useRef<View>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate>(shareTemplates[0]);
  const { mutate: trackShare } = useShareQuote();

  const handleShareImage = useCallback(async () => {
    if (!data || !captureRef_.current) return;
    haptics.medium();
    try {
      const uri = await captureRef(captureRef_, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      const result = await Share.open({ url: uri, type: 'image/png' });
      trackShare({
        uuid: data.uuid,
        payload: {
          type: 'image',
          template: selectedTemplate.id,
          platform: result.message || undefined,
        },
      });
    } catch {
      // User cancelled
    }
    onClose();
  }, [data, onClose, selectedTemplate.id, trackShare]);

  const handleShareLink = useCallback(async () => {
    if (!data) return;
    haptics.medium();
    try {
      const baseUrl = process.env.EXPO_PUBLIC_APP_URL || 'https://echoes.carlos3g.dev';
      const result = await Share.open({ url: `${baseUrl}/quotes/${data.uuid}` });
      trackShare({
        uuid: data.uuid,
        payload: {
          type: 'link',
          platform: result.message || undefined,
        },
      });
    } catch {
      // User cancelled
    }
    onClose();
  }, [data, onClose, trackShare]);

  const handleSelectTemplate = (template: ShareTemplate) => {
    haptics.light();
    setSelectedTemplate(template);
  };

  if (!data) return null;

  return (
    <Portal>
      <View style={{ position: 'absolute', left: -9999, top: -9999 }}>
        <ShareImageTemplate ref={captureRef_} data={data} template={selectedTemplate} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={['65%']}
        onClose={onClose}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8 }}>
          <Text variant="headingSmall" className="mb-4 text-center text-foreground">
            {t('share.title')}
          </Text>

          <SharePreview data={data} template={selectedTemplate} />

          <View className="mt-4 flex-row items-center justify-center gap-3">
            {shareTemplates.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => handleSelectTemplate(t)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: t.previewDot,
                  borderWidth: selectedTemplate.id === t.id ? 3 : 1,
                  borderColor: selectedTemplate.id === t.id ? colors.primary : colors.border,
                }}
              />
            ))}
          </View>

          <View className="mt-5 gap-3">
            <Button title={t('share.shareImage')} onPress={handleShareImage} />
            <Button title={t('share.shareLink')} variant="outline" onPress={handleShareLink} />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
};
