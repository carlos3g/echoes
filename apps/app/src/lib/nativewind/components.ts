import { Ionicons as ExpoIonicons } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';
import RNBottomSheet, { BottomSheetFooter as RNBottomSheetFooter } from '@gorhom/bottom-sheet';

export const Ionicons = cssInterop(ExpoIonicons, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: 'color',
    },
  },
});

export const BottomSheet = cssInterop(RNBottomSheet, {
  className: {
    target: 'style',
  },
  handleClassName: {
    target: 'handleStyle',
  },
  containerClassName: {
    target: 'containerStyle',
  },
  backgroundClassName: {
    target: 'backgroundStyle',
  },
  handleIndicatorClassName: {
    target: 'handleIndicatorStyle',
  },
});

export const BottomSheetFooter = cssInterop(RNBottomSheetFooter, {
  className: {
    target: 'style',
  },
});
