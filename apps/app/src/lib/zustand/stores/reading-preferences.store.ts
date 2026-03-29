import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStateStorage } from '@/lib/zustand';

export type QuoteFont = 'playfair' | 'lora' | 'merriweather' | 'crimson';

export const quoteFontConfig: Record<QuoteFont, { label: string; family: string; italicFamily: string }> = {
  playfair: {
    label: 'Playfair Display',
    family: 'PlayfairDisplay-Regular',
    italicFamily: 'PlayfairDisplay-Italic',
  },
  lora: {
    label: 'Lora',
    family: 'Lora-Regular',
    italicFamily: 'Lora-Italic',
  },
  merriweather: {
    label: 'Merriweather',
    family: 'Merriweather-Regular',
    italicFamily: 'Merriweather-Italic',
  },
  crimson: {
    label: 'Crimson Text',
    family: 'CrimsonText-Regular',
    italicFamily: 'CrimsonText-Italic',
  },
};

export type LineHeightOption = 'auto' | 'compact' | 'normal' | 'relaxed';

export const lineHeightMultipliers: Record<LineHeightOption, number> = {
  auto: 1.7,
  compact: 1.4,
  normal: 1.6,
  relaxed: 1.9,
};

export const lineHeightLabels: Record<LineHeightOption, string> = {
  auto: 'Auto',
  compact: 'Compacto',
  normal: 'Normal',
  relaxed: 'Relaxado',
};

export function getLineHeight(fontSize: number, option: LineHeightOption): number {
  return fontSize * lineHeightMultipliers[option];
}

interface ReadingPreferencesState {
  font: QuoteFont;
  fontSize: number;
  lineHeight: LineHeightOption;
  setFont: (font: QuoteFont) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (lineHeight: LineHeightOption) => void;
}

export const MIN_FONT_SIZE = 14;
export const MAX_FONT_SIZE = 28;
export const DEFAULT_FONT_SIZE = 18;

export const SIZE_OPTIONS = [MIN_FONT_SIZE, 17, 20, 23, MAX_FONT_SIZE];

export const useReadingPreferencesStore = create<ReadingPreferencesState>()(
  persist(
    (set) => ({
      font: 'playfair',
      fontSize: DEFAULT_FONT_SIZE,
      lineHeight: 'auto',
      setFont: (font) => set({ font }),
      setFontSize: (fontSize) => set({ fontSize: Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, fontSize)) }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
    }),
    {
      name: 'reading-preferences',
      version: 2,
      storage: createJSONStorage(() => zustandStateStorage),
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          state.lineHeight = 'auto';
        }
        return state as unknown as ReadingPreferencesState;
      },
    }
  )
);
