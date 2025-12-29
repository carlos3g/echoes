import type RNBottomSheet from '@gorhom/bottom-sheet';
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Portal } from 'react-native-portalize';
import type { Quote } from '@/types/entities';
import { TagQuoteBottomSheet } from './tag-quote-bottom-sheet';

interface TagQuoteBottomSheetContextValue {
  quote: Quote | null;
  show: (quote: Quote) => void;
  hide: () => void;
}

const TagQuoteBottomSheetContext = createContext<TagQuoteBottomSheetContextValue | null>(null);

export const useTagQuoteBottomSheet = () => {
  const context = useContext(TagQuoteBottomSheetContext);

  if (!context) {
    throw new Error('useTagQuoteBottomSheet must be used within TagQuoteBottomSheetProvider');
  }

  return context;
};

interface TagQuoteBottomSheetProviderProps {
  children: React.ReactNode;
}

export const TagQuoteBottomSheetProvider: React.FC<TagQuoteBottomSheetProviderProps> = ({ children }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const bottomSheetRef = useRef<RNBottomSheet>(null);

  const show = useCallback((q: Quote) => {
    setQuote(q);
    bottomSheetRef.current?.expand();
  }, []);

  const hide = useCallback(() => {
    setQuote(null);
    bottomSheetRef.current?.close();
  }, []);

  const value = useMemo(() => ({ quote, show, hide }), [quote, show, hide]);

  return (
    <TagQuoteBottomSheetContext.Provider value={value}>
      {children}

      <Portal>
        <TagQuoteBottomSheetContext.Provider value={value}>
          <TagQuoteBottomSheet ref={bottomSheetRef} />
        </TagQuoteBottomSheetContext.Provider>
      </Portal>
    </TagQuoteBottomSheetContext.Provider>
  );
};
