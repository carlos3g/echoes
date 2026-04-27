import type RNBottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useFolderMembers } from '@/features/folder/hooks/use-folder-members';
import { useFolderDetail } from '@/features/folder/hooks/use-folder-detail';
import { useRemoveMember } from '@/features/folder/hooks/use-remove-member';
import { InviteMemberBottomSheet } from '@/features/folder/components/invite-member-bottom-sheet';
import { Text } from '@/shared/components/ui/text';
import { ActivityIndicator } from '@/shared/components/ui/activity-indicator';
import { Fab } from '@/shared/components/ui/fab';
import { useTheme } from '@/lib/nativewind/theme.context';
import type { FolderMember } from '@/types/entities';

const ROLE_I18N_KEYS: Record<string, string> = {
  OWNER: 'folder.roleOwner',
  EDITOR: 'folder.roleEditor',
  VIEWER: 'folder.roleViewer',
};

function MemberItem({ member, isOwner, folderUuid }: { member: FolderMember; isOwner: boolean; folderUuid: string }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { mutate: removeMember } = useRemoveMember();

  const handleRemove = useCallback(() => {
    Alert.alert(t('folder.removeMemberTitle'), t('folder.removeMemberMessage', { name: member.user.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => removeMember({ folderUuid, userUuid: member.user.uuid }),
      },
    ]);
  }, [folderUuid, member.user, removeMember, t]);

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="flex-1 flex-row items-center gap-3">
        <Ionicons name="person-circle-outline" size={36} color={colors.mutedForeground} />
        <View>
          <Text variant="paragraphSmall" semiBold>
            {member.user.name}
          </Text>
          <Text variant="paragraphCaption" className="text-muted-foreground">
            @{member.user.username} · {t(ROLE_I18N_KEYS[member.role] ?? member.role)}
          </Text>
        </View>
      </View>

      {isOwner && member.role !== 'OWNER' && (
        <TouchableOpacity onPress={handleRemove} hitSlop={12}>
          <Ionicons name="close-circle-outline" size={22} color={colors.mutedForeground} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function FolderMembersScreen() {
  const { folderUuid } = useLocalSearchParams<{ folderUuid: string }>();
  const { t } = useTranslation();
  const inviteSheetRef = useRef<RNBottomSheet>(null);
  const { data: members, isLoading } = useFolderMembers(folderUuid);
  const { data: folder } = useFolderDetail(folderUuid);

  const isOwner = folder?.metadata?.memberRole === 'OWNER';

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={members}
        keyExtractor={(item, index) => `${item.user.uuid}-${index}`}
        renderItem={({ item }) => <MemberItem member={item} isOwner={isOwner} folderUuid={folderUuid} />}
        ListEmptyComponent={
          <View className="items-center py-8">
            <Text variant="paragraphSmall" className="text-muted-foreground">
              {t('folder.noMembers')}
            </Text>
          </View>
        }
      />

      {isOwner && (
        <>
          <InviteMemberBottomSheet ref={inviteSheetRef} folderUuid={folderUuid} />
          <Fab
            testID="invite-member-fab"
            iconName="person-add-outline"
            onPress={() => inviteSheetRef.current?.expand()}
          />
        </>
      )}
    </View>
  );
}
