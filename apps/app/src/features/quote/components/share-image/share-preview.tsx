import React from 'react';
import { View } from 'react-native';
import type { Quote } from '@/types/entities';
import type { ShareTemplate } from './share-templates';
import { ShareImageTemplate } from './share-image-template';

interface SharePreviewProps {
  data: Quote;
  template: ShareTemplate;
}

const PREVIEW_SCALE = 0.15;
const PREVIEW_WIDTH = 1080 * PREVIEW_SCALE;
const PREVIEW_HEIGHT = 1920 * PREVIEW_SCALE;

export const SharePreview: React.FC<SharePreviewProps> = ({ data, template }) => {
  return (
    <View
      style={{
        width: PREVIEW_WIDTH,
        height: PREVIEW_HEIGHT,
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'center',
      }}
    >
      <ShareImageTemplate data={data} template={template} scale={PREVIEW_SCALE} />
    </View>
  );
};
