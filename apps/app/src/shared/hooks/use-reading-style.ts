import { useMemo } from 'react';
import {
  useReadingPreferencesStore,
  quoteFontConfig,
  getLineHeight,
} from '@/lib/zustand/stores/reading-preferences.store';
import type { TextStyle } from 'react-native';

export function useReadingStyle() {
  const font = useReadingPreferencesStore((s) => s.font);
  const fontSize = useReadingPreferencesStore((s) => s.fontSize);
  const lineHeightOption = useReadingPreferencesStore((s) => s.lineHeight);

  const config = quoteFontConfig[font];

  const quoteStyle = useMemo<TextStyle>(
    () => ({
      fontFamily: config.italicFamily,
      fontSize,
      lineHeight: getLineHeight(fontSize, lineHeightOption),
    }),
    [config.italicFamily, fontSize, lineHeightOption]
  );

  const quoteLargeStyle = useMemo<TextStyle>(
    () => ({
      fontFamily: config.italicFamily,
      fontSize: fontSize + 4,
      lineHeight: getLineHeight(fontSize + 4, lineHeightOption),
    }),
    [config.italicFamily, fontSize, lineHeightOption]
  );

  return { quoteStyle, quoteLargeStyle, fontFamily: config.family, italicFamily: config.italicFamily };
}
