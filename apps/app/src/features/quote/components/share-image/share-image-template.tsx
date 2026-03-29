import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { Quote } from '@/types/entities';
import type { ShareTemplate } from './share-templates';
import { shareTemplates } from './share-templates';

interface ShareImageTemplateProps {
  data: Quote;
  template?: ShareTemplate;
  scale?: number;
}

export const ShareImageTemplate = React.forwardRef<View, ShareImageTemplateProps>(
  ({ data, template = shareTemplates[0], scale = 1 }, ref) => {
    const w = 1080 * scale;
    const h = 1920 * scale;
    const s = scale;

    const bgColor = typeof template.background === 'string' ? template.background : template.background.colors[0];

    return (
      <View
        ref={ref}
        collapsable={false}
        style={{
          width: w,
          height: h,
          backgroundColor: bgColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 120 * s,
        }}
      >
        {template.quoteMarkColor && (
          <RNText
            style={{
              fontFamily: 'PlayfairDisplay-Regular',
              fontSize: 120 * s,
              lineHeight: 120 * s,
              color: template.quoteMarkColor,
              opacity: 0.5,
              marginBottom: 20 * s,
            }}
          >
            {'\u201C'}
          </RNText>
        )}

        <RNText
          style={{
            fontFamily: 'PlayfairDisplay-Italic',
            fontSize: 56 * s,
            lineHeight: 84 * s,
            color: template.textColor,
            textAlign: 'center',
          }}
        >
          {data.body}
        </RNText>

        <View
          style={{
            width: 100 * s,
            height: 4 * s,
            backgroundColor: template.separatorColor,
            marginTop: 48 * s,
            marginBottom: 32 * s,
            borderRadius: 2 * s,
          }}
        />

        <RNText
          style={{
            fontFamily: 'DMSans-SemiBold',
            fontSize: 28 * s,
            color: template.authorColor,
            letterSpacing: 6 * s,
            textAlign: 'center',
          }}
        >
          {data.author?.name?.toUpperCase() ?? 'AUTOR DESCONHECIDO'}
        </RNText>

        <RNText
          style={{
            fontFamily: 'DMSans-Medium',
            fontSize: 20 * s,
            color: template.brandingColor,
            letterSpacing: 4 * s,
            position: 'absolute',
            bottom: 80 * s,
          }}
        >
          ECHOES
        </RNText>
      </View>
    );
  }
);
