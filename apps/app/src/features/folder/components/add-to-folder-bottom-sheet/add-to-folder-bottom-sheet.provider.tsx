import type RNBottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Portal } from 'react-native-portalize';
import type { Quote } from '@/types/entities';
import { AddToFolderBottomSheetContext } from './add-to-folder-bottom-sheet.context';
import { AddToFolderBottomSheet } from './add-to-folder-bottom-sheet';

interface AddToFolderBottomSheetProviderProps {
  children: React.ReactNode;
}

export const AddToFolderBottomSheetProvider: React.FC<AddToFolderBottomSheetProviderProps> = ({ children }) => {
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
    <AddToFolderBottomSheetContext.Provider value={value}>
      {children}

      {mounted && (
        <Portal>
          <AddToFolderBottomSheetContext.Provider value={value}>
            <AddToFolderBottomSheet ref={bottomSheetRef} onDismiss={handleClose} />
          </AddToFolderBottomSheetContext.Provider>
        </Portal>
      )}
    </AddToFolderBottomSheetContext.Provider>
  );
};
