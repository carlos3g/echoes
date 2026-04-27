import React, { createContext, useContext } from 'react';
import type { Quote } from '@/types/entities';

interface AddToFolderBottomSheetContextValue {
  quote: Quote | null;
  show: (quote: Quote) => void;
  hide: () => void;
}

export const AddToFolderBottomSheetContext = createContext<AddToFolderBottomSheetContextValue | null>(null);

export const useAddToFolderBottomSheet = () => {
  const context = useContext(AddToFolderBottomSheetContext);

  if (!context) {
    throw new Error('useAddToFolderBottomSheet must be used within AddToFolderBottomSheetProvider');
  }

  return context;
};
