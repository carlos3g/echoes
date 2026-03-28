import type { FlashListProps } from '@shopify/flash-list';
import { FlashList as RNFlashList } from '@shopify/flash-list';
import type React from 'react';

// Type assertion needed due to cssInterop incompatibility with NativeWind
export const FlashList = RNFlashList as unknown as <T>(props: FlashListProps<T>) => React.ReactElement;
