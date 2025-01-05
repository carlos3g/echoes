import { View } from 'react-native';
import { Text } from '@/shared/components/ui/text';

interface ManageTagsScreenProps {}

export const ManageTagsScreen: React.FC<ManageTagsScreenProps> = () => {
  return (
    <View className="flex-1 pt-4">
      <Text variant="headingSmall">ManageTagsScreen</Text>
    </View>
  );
};
