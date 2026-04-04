import type { BottomSheetBackdropProps, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import type RNBottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Portal } from 'react-native-portalize';
import type { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppSafeArea } from '@/shared/hooks/use-app-safe-area';
import { Button } from '@/shared/components/ui/button';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { createFolderFormSchema } from '@/features/folder/validations';
import { useCreateFolder } from '@/features/folder/hooks/use-create-folder';
import { useTheme } from '@/lib/nativewind/theme.context';
import { BottomSheet, BottomSheetFooter } from '@/lib/nativewind/components';

type CreateFolderFormData = z.infer<ReturnType<typeof createFolderFormSchema>>;

export const CreateFolderBottomSheet = React.forwardRef<RNBottomSheet>((props, ref) => {
  const { bottom } = useAppSafeArea();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const form = useForm<CreateFolderFormData>({
    resolver: zodResolver(createFolderFormSchema()),
  });

  const { mutate, isPending } = useCreateFolder({
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = form.handleSubmit((data: CreateFolderFormData) => {
    mutate({ name: data.name, description: data.description, color: data.color, visibility: data.visibility });
  });

  const renderBackdrop = (backdropProps: BottomSheetBackdropProps) => <BottomSheetBackdrop {...backdropProps} />;

  const renderFooter = (footerProps: BottomSheetFooterProps) => (
    <BottomSheetFooter
      {...footerProps}
      bottomInset={bottom + 16}
      className="px-4"
      style={{ backgroundColor: colors.background }}
    >
      <Button
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        title={t('common.create')}
        testID="create-folder-button"
      />
    </BottomSheetFooter>
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
        snapPoints={['60%']}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
      >
        <BottomSheetView className="gap-4 px-4">
          <ControlledTextInput
            control={form.control}
            autoFocus
            name="name"
            label={t('folder.createNameLabel')}
            placeholder={t('folder.createNamePlaceholder')}
            testID="folder-name-input"
          />
          <ControlledTextInput
            control={form.control}
            name="description"
            label={t('folder.createDescriptionLabel')}
            placeholder={t('folder.createDescriptionPlaceholder')}
            testID="folder-description-input"
          />
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});
