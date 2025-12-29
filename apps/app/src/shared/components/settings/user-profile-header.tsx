import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { User } from '@/types/entities';
import { Text } from '@/shared/components/ui/text';
import { userAvatarUrl } from '@/shared/utils';

interface UserProfileHeaderProps {
  user: User;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ user }) => {
  return (
    <View
      className="flex flex-col items-center border-border px-4 py-6"
      style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
    >
      <Image
        testID="user-avatar"
        source={{
          uri: userAvatarUrl(user),
        }}
        className="mb-3 h-40 w-40 rounded-full border-border"
        style={{ borderWidth: StyleSheet.hairlineWidth }}
      />
      <Text testID="user-name" variant="headingSmall">
        {user.name}
      </Text>
      <Text testID="user-username" variant="paragraphLarge" className="text-muted-foreground">
        @{user.username}
      </Text>
    </View>
  );
};
