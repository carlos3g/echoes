import React from 'react';
import { TouchableOpacity } from 'react-native';
import Share from 'react-native-share';
import type { Quote } from '@/types/entities';
import { Ionicons } from '@/lib/nativewind/components';

interface ShareButtonProps {
  data: Quote;
}

export const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const { data } = props;

  const handleShare = async () => {
    const baseUrl = process.env.EXPO_PUBLIC_APP_URL || 'https://echoes.carlos3g.dev';
    await Share.open({ url: `${baseUrl}/quotes/${data.uuid}` });
  };

  return (
    <TouchableOpacity
      testID="share-button"
      onPress={handleShare}
      accessibilityLabel="Compartilhar citação"
      accessibilityRole="button"
    >
      <Ionicons name="share-social-outline" size={20} className="text-muted-foreground" />
    </TouchableOpacity>
  );
};
