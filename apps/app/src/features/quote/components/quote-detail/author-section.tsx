import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';
import { Text } from '@/shared/components/ui/text';

interface AuthorSectionProps {
  author: {
    uuid: string;
    name: string;
    bio?: string;
  };
}

export const AuthorSection: React.FC<AuthorSectionProps> = ({ author }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/(app)/(tabs)/(explore)/author/[authorUuid]',
          params: { authorUuid: author.uuid },
        })
      }
      className="flex-row items-center gap-4 border-t border-border px-6 py-5"
      activeOpacity={0.7}
      accessibilityRole="link"
      accessibilityLabel={`Ver perfil de ${author.name}`}
    >
      <AvatarInitials name={author.name} size="md" />
      <View className="flex-1">
        <Text className="font-playfair-semi-bold text-heading-small text-foreground">{author.name}</Text>
        {author.bio && (
          <Text variant="paragraphSmall" className="mt-1 text-muted-foreground" numberOfLines={2}>
            {author.bio}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
