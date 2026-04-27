import React from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/shared/components/ui/text';
import { useTheme } from '@/lib/nativewind/theme.context';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'document-text-outline', title, description }) => {
  const { colors } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(400)} className="flex-1 items-center justify-center px-8 py-16">
      <Ionicons name={icon} size={48} color={colors.mutedForeground} style={{ marginBottom: 16 }} />
      <Text variant="headingSmall" className="text-center text-foreground">
        {title}
      </Text>
      {description && (
        <Text variant="paragraphSmall" className="mt-2 text-center text-muted-foreground">
          {description}
        </Text>
      )}
    </Animated.View>
  );
};
