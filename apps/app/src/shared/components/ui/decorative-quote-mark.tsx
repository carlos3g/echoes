import React from 'react';
import { Text as RNText } from 'react-native';
import { useTheme } from '@/lib/nativewind/theme.context';

interface DecorativeQuoteMarkProps {
  size?: number;
  opacity?: number;
}

export const DecorativeQuoteMark: React.FC<DecorativeQuoteMarkProps> = ({ size = 40, opacity = 0.4 }) => {
  const { colors } = useTheme();

  return (
    <RNText
      style={{
        fontFamily: 'PlayfairDisplay-Regular',
        fontSize: size,
        lineHeight: size,
        color: colors.primary,
        opacity,
      }}
    >
      {'\u201C'}
    </RNText>
  );
};
