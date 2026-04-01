import React from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '@/shared/components/ui/text';
import { AvatarInitials } from '@/shared/components/ui/avatar-initials';
import { haptics } from '@/shared/utils/haptics';

interface ActivityAuthorCardProps {
  uuid: string;
  name: string;
}

export const ActivityAuthorCard: React.FC<ActivityAuthorCardProps> = ({ uuid, name }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        haptics.selection();
        router.push({ pathname: '/(app)/(tabs)/(explore)/author/[authorUuid]', params: { authorUuid: uuid } });
      }}
      className="mt-2 flex-row items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5"
    >
      <AvatarInitials name={name} size="sm" />
      <Text variant="paragraphSmall" className="text-foreground">
        {name}
      </Text>
    </Pressable>
  );
};
