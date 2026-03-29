import { haptics } from '@/shared/utils/haptics';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Quote } from '@/types/entities';
import { Ionicons } from '@/lib/nativewind/components';
import { ShareImageBottomSheet } from '@/features/quote/components/share-image/share-image-bottom-sheet';

interface ShareButtonProps {
  data: Quote;
}

export const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const [showSheet, setShowSheet] = useState(false);

  return (
    <>
      <TouchableOpacity
        testID="share-button"
        onPress={() => {
          haptics.medium();
          setShowSheet(true);
        }}
        accessibilityLabel={t('quote.shareLabel')}
        accessibilityRole="button"
        activeOpacity={0.7}
        hitSlop={12}
      >
        <Ionicons name="share-social-outline" size={20} className="text-muted-foreground" />
      </TouchableOpacity>

      {showSheet && <ShareImageBottomSheet data={data} onClose={() => setShowSheet(false)} />}
    </>
  );
};
