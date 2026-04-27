import type { BottomSheetBackdropProps, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import type RNBottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useState } from 'react';
import { Pressable, Share, View } from 'react-native';
import { Portal } from 'react-native-portalize';
import { useTranslation } from 'react-i18next';
import { useAppSafeArea } from '@/shared/hooks/use-app-safe-area';
import { Button } from '@/shared/components/ui/button';
import { TextInput } from '@/shared/components/ui/text-input';
import { Text } from '@/shared/components/ui/text';
import { useInviteByUsername } from '@/features/folder/hooks/use-invite-by-username';
import { useCreateInviteLink } from '@/features/folder/hooks/use-create-invite-link';
import { useTheme } from '@/lib/nativewind/theme.context';
import { BottomSheet, BottomSheetFooter } from '@/lib/nativewind/components';

interface InviteMemberBottomSheetProps {
  folderUuid: string;
}

export const InviteMemberBottomSheet = React.forwardRef<RNBottomSheet, InviteMemberBottomSheetProps>(
  ({ folderUuid }, ref) => {
    const { bottom } = useAppSafeArea();
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [selectedRole, setSelectedRole] = useState<'EDITOR' | 'VIEWER'>('VIEWER');

    const { mutate: invite, isPending: isInviting } = useInviteByUsername({
      folderUuid,
      onSuccess: () => setUsername(''),
    });

    const { mutate: createLink, isPending: isCreatingLink } = useCreateInviteLink({
      folderUuid,
      onSuccess: (link) => {
        void Share.share({ message: t('folder.inviteLinkMessage', { link: link.uuid }) });
      },
    });

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => <BottomSheetBackdrop {...backdropProps} />,
      []
    );

    const renderFooter = useCallback(
      (footerProps: BottomSheetFooterProps) => (
        <BottomSheetFooter
          {...footerProps}
          bottomInset={bottom + 16}
          className="gap-2 px-4"
          style={{ backgroundColor: colors.background }}
        >
          <Button
            loading={isInviting}
            disabled={!username.trim()}
            onPress={() => invite({ username: username.trim(), role: selectedRole })}
            title={t('folder.inviteByUsername')}
            testID="invite-username-button"
          />
          <Button
            loading={isCreatingLink}
            onPress={() => createLink({ role: selectedRole })}
            title={t('folder.createInviteLink')}
            testID="create-invite-link-button"
          />
        </BottomSheetFooter>
      ),
      [bottom, isInviting, isCreatingLink, username, selectedRole, invite, createLink, colors.background, t]
    );

    return (
      <Portal>
        {/* @ts-expect-error BottomSheet types incompatible with cssInterop */}
        <BottomSheet
          ref={ref}
          index={-1}
          footerComponent={renderFooter}
          backdropComponent={renderBackdrop}
          enablePanDownToClose
          snapPoints={['55%']}
          backgroundStyle={{ backgroundColor: colors.background }}
          handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
        >
          <BottomSheetView className="gap-4 px-4">
            <Text variant="paragraphMedium" semiBold>
              {t('folder.inviteTitle')}
            </Text>

            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder={t('folder.inviteUsernamePlaceholder')}
            />

            <View>
              <Text variant="paragraphSmall" semiBold className="mb-2">
                {t('folder.inviteRoleLabel')}
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  className={`flex-1 items-center rounded-xl border py-2 ${selectedRole === 'VIEWER' ? 'border-primary bg-primary' : 'border-border bg-muted'}`}
                  onPress={() => setSelectedRole('VIEWER')}
                >
                  <Text
                    variant="paragraphSmall"
                    semiBold
                    className={selectedRole === 'VIEWER' ? 'text-primary-foreground' : 'text-muted-foreground'}
                  >
                    {t('folder.roleViewer')}
                  </Text>
                </Pressable>
                <Pressable
                  className={`flex-1 items-center rounded-xl border py-2 ${selectedRole === 'EDITOR' ? 'border-primary bg-primary' : 'border-border bg-muted'}`}
                  onPress={() => setSelectedRole('EDITOR')}
                >
                  <Text
                    variant="paragraphSmall"
                    semiBold
                    className={selectedRole === 'EDITOR' ? 'text-primary-foreground' : 'text-muted-foreground'}
                  >
                    {t('folder.roleEditor')}
                  </Text>
                </Pressable>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  }
);
