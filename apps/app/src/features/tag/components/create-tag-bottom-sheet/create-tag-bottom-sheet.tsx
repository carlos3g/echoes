import type { BottomSheetBackdropProps, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import type RNBottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Portal } from 'react-native-portalize';
import type { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useAppSafeArea } from '@/shared/hooks/use-app-safe-area';
import { Button } from '@/shared/components/ui/button';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { createTagFormSchema } from '@/features/tag/validations';
import { useCreateTag } from '@/features/tag/hooks/use-create-tag';
import { useTheme } from '@/lib/nativewind/theme.context';
import { BottomSheet, BottomSheetFooter } from '@/lib/nativewind/components';

type CreateTagFormData = z.infer<ReturnType<typeof createTagFormSchema>>;

export const CreateTagBottomSheet = React.forwardRef<RNBottomSheet>((props, ref) => {
  const { bottom } = useAppSafeArea();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const form = useForm<CreateTagFormData>({
    resolver: zodResolver(createTagFormSchema()),
  });

  const { mutate, isPending } = useCreateTag({
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = form.handleSubmit((data: CreateTagFormData) => {
    mutate(data);
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
        className="px-4"
        style={{ backgroundColor: colors.background }}
      >
        <Button
          loading={isPending}
          disabled={!form.formState.isValid}
          onPress={onSubmit}
          title={t('common.create')}
          testID="create-tag-button"
        />
      </BottomSheetFooter>
    ),
    [bottom, isPending, onSubmit, form.formState.isValid, colors.background]
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
        snapPoints={['50%']}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.mutedForeground }}
      >
        <BottomSheetView className="px-4">
          <ControlledTextInput
            control={form.control}
            autoFocus
            name="title"
            label={t('tag.createTitle')}
            placeholder={t('tag.createPlaceholder')}
            testID="tag-title-input"
          />
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});
