import type React from 'react';
import { ScrollView, View } from 'react-native';

export const ScrollViewContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ScrollView keyboardShouldPersistTaps="handled" className="bg-background flex-1">
      {children}
    </ScrollView>
  );
};

export const ViewContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <View className="bg-background flex-1">{children}</View>;
};
