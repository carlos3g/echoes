import { haptics } from '@/shared/utils/haptics';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import type { Quote } from '@/types/entities';
import { useTranslation } from 'react-i18next';
import { useAddToFolderBottomSheet } from '@/features/folder/components/add-to-folder-bottom-sheet';
import { Ionicons } from '@/lib/nativewind/components';

interface FolderButtonProps {
  data: Quote;
}

export const FolderButton: React.FC<FolderButtonProps> = (props) => {
  const { data } = props;
  const { show } = useAddToFolderBottomSheet();
  const { t } = useTranslation();

  const handlePress = () => {
    haptics.selection();
    show(data);
  };

  return (
    <TouchableOpacity
      testID="add-to-folder-button"
      className="flex-row items-center gap-1"
      onPress={handlePress}
      accessibilityLabel={t('folder.addToFolder')}
      accessibilityRole="button"
      activeOpacity={0.7}
      hitSlop={12}
    >
      <Ionicons name="folder-outline" size={19} className="text-muted-foreground" />
    </TouchableOpacity>
  );
};
