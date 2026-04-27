import React, { createContext, useContext } from 'react';
import type { Quote } from '@/types/entities';

interface TagQuoteBottomSheetContextValue {
  quote: Quote | null;
  show: (quote: Quote) => void;
  hide: () => void;
}

export const TagQuoteBottomSheetContext = createContext<TagQuoteBottomSheetContextValue | null>(null);

export const useTagQuoteBottomSheet = () => {
  const context = useContext(TagQuoteBottomSheetContext);

  if (!context) {
    throw new Error('useTagQuoteBottomSheet must be used within TagQuoteBottomSheetProvider');
  }

  return context;
};
