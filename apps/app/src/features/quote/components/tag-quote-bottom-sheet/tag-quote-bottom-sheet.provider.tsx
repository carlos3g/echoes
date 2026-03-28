import type RNBottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Portal } from 'react-native-portalize';
import type { Quote } from '@/types/entities';
import { TagQuoteBottomSheetContext } from './tag-quote-bottom-sheet.context';
import { TagQuoteBottomSheet } from './tag-quote-bottom-sheet';

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
