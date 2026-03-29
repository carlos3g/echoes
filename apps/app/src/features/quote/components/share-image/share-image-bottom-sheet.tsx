import React, { useCallback, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Portal } from 'react-native-portalize';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share';
import { Ionicons } from '@expo/vector-icons';
import type { Quote } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';
import { ShareImageTemplate } from './share-image-template';

interface ShareImageBottomSheetProps {
  data: Quote | null;
  onClose: () => void;
}

export const ShareImageBottomSheet: React.FC<ShareImageBottomSheetProps> = ({ data, onClose }) => {
  const { colors } = useTheme();
  const templateRef = useRef<View>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleShareText = useCallback(async () => {
    if (!data) return;
    const baseUrl = process.env.EXPO_PUBLIC_APP_URL || 'https://echoes.carlos3g.dev';
    await Share.open({ url: `${baseUrl}/quotes/${data.uuid}` });
    onClose();
  }, [data, onClose]);

  const handleShareImage = useCallback(async () => {
    if (!data || !templateRef.current) return;
    try {
      const uri = await captureRef(templateRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      await Share.open({
        url: uri,
        type: 'image/png',
      });
    } catch {
      // User cancelled share
    }
    onClose();
  }, [data, onClose]);

  if (!data) return null;

  return (
    <Portal>
      {/* Offscreen template for capture */}
      <View style={{ position: 'absolute', left: -9999, top: -9999 }}>
        <ShareImageTemplate ref={templateRef} data={data} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[240]}
        onClose={onClose}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.4} />
        )}
      >
        <BottomSheetView style={{ paddingHorizontal: 24, paddingTop: 8 }}>
          <Text variant="headingSmall" className="mb-4 text-foreground">
            Compartilhar
          </Text>

          <TouchableOpacity onPress={handleShareText} className="flex-row items-center gap-4 py-3" activeOpacity={0.7}>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Ionicons name="link-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text semiBold className="text-foreground">
                Compartilhar link
              </Text>
              <Text variant="paragraphSmall" className="text-muted-foreground">
                Envia o link da citacao
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShareImage} className="flex-row items-center gap-4 py-3" activeOpacity={0.7}>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Ionicons name="image-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text semiBold className="text-foreground">
                Compartilhar como imagem
              </Text>
              <Text variant="paragraphSmall" className="text-muted-foreground">
                Gera uma imagem para stories
              </Text>
            </View>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
};
