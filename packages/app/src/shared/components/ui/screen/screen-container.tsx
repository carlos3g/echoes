import type React from 'react';
import { ScrollView, View } from 'react-native';

export const ScrollViewContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <ScrollView keyboardShouldPersistTaps="handled" className="flex-1 bg-background">
      {children}
    </ScrollView>
  );
};

export const ViewContainer: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <View className="flex-1 bg-background">{children}</View>;
};
