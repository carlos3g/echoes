import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from 'react-i18next';
import { haptics } from '@/shared/utils/haptics';
import type { Quote } from '@/types/entities';
import { Ionicons } from '@/lib/nativewind/components';
import { toast } from 'sonner-native';

interface CopyButtonProps {
  data: Quote;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ data }) => {
  const { t } = useTranslation();

  const handleCopy = useCallback(async () => {
    haptics.success();
    await Clipboard.setStringAsync(data.body);
    toast.success(t('quote.copiedToast'));
  }, [data.body, t]);

  return (
    <TouchableOpacity
      testID="copy-button"
      onPress={handleCopy}
      accessibilityLabel={t('quote.copyLabel')}
      accessibilityRole="button"
      activeOpacity={0.7}
      hitSlop={12}
    >
      <Ionicons name="copy-outline" size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );
};
