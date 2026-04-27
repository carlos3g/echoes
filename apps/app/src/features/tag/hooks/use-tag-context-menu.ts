import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUpdateTag } from '@/features/tag/hooks/use-update-tag';
import { useDeleteTag } from '@/features/tag/hooks/use-delete-tag';

interface UseTagContextMenuProps {
  onDelete?: (uuid: string) => void;
}

export const useTagContextMenu = ({ onDelete }: UseTagContextMenuProps = {}) => {
  const { t } = useTranslation();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  const showContextMenu = useCallback(
    (item: { uuid: string; title: string }) => {
      Alert.alert(item.title, undefined, [
        {
          text: t('common.rename'),
          onPress: () => {
            Alert.prompt(
              t('tag.renameTitle'),
              undefined,
              (newTitle) => {
                if (newTitle && newTitle.trim().length > 0 && newTitle.trim().length <= 50) {
                  updateTagMutation.mutate({ uuid: item.uuid, title: newTitle.trim() });
                }
              },
              'plain-text',
              item.title
            );
          },
        },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(t('tag.deleteConfirmTitle'), t('tag.deleteConfirmMessage', { title: item.title }), [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('common.delete'),
                style: 'destructive',
                onPress: () => {
                  deleteTagMutation.mutate(item.uuid);
                  onDelete?.(item.uuid);
                },
              },
            ]);
          },
        },
        { text: t('common.cancel'), style: 'cancel' },
      ]);
    },
    [t, updateTagMutation, deleteTagMutation, onDelete]
  );

  return { showContextMenu };
};
