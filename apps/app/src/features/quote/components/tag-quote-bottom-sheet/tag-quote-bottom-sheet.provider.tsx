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
  const [mounted, setMounted] = useState(false);
  const bottomSheetRef = useRef<RNBottomSheet>(null);

  const show = useCallback((q: Quote) => {
    setQuote(q);
    setMounted(true);
  }, []);

  const hide = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleClose = useCallback(() => {
    setQuote(null);
    setMounted(false);
  }, []);

  const value = useMemo(() => ({ quote, show, hide }), [quote, show, hide]);

  return (
    <TagQuoteBottomSheetContext.Provider value={value}>
      {children}

      {mounted && (
        <Portal>
          <TagQuoteBottomSheetContext.Provider value={value}>
            <TagQuoteBottomSheet ref={bottomSheetRef} onDismiss={handleClose} />
          </TagQuoteBottomSheetContext.Provider>
        </Portal>
      )}
    </TagQuoteBottomSheetContext.Provider>
  );
};
