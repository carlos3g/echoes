import React from 'react';
import { View } from 'react-native';
import { Text } from '@/shared/components/ui/text';

export const TagListEmpty: React.FC = () => (
  <View className="items-center py-4">
    <Text>Nenhuma tag cadastrada</Text>
  </View>
);
