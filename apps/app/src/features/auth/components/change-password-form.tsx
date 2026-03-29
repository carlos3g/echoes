import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import type { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { createChangePasswordFormSchema } from '@/features/auth/validations';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { Button } from '@/shared/components/ui/button';
import { useChangePassword } from '@/features/auth/hooks/use-change-password';

type ChangePasswordFormData = z.infer<ReturnType<typeof createChangePasswordFormSchema>>;

export const ChangePasswordForm: React.FC = () => {
  const { t } = useTranslation();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(createChangePasswordFormSchema()),
    defaultValues: {},
    mode: 'onChange',
  });

  const { mutate, isPending } = useChangePassword();

  const onSubmit = form.handleSubmit((data: ChangePasswordFormData) => {
    mutate(data);
  });

  return (
    <>
      <View className="mb-5 gap-5">
        <ControlledPasswordInput
          testID="current-password-input"
          control={form.control}
          name="currentPassword"
          label={t('form.currentPassword')}
          placeholder={t('form.currentPasswordPlaceholder')}
        />
        <ControlledPasswordInput
          testID="new-password-input"
          control={form.control}
          name="password"
          label={t('form.newPassword')}
          placeholder={t('form.newPasswordPlaceholder')}
        />
        <ControlledPasswordInput
          testID="new-password-confirmation-input"
          control={form.control}
          name="passwordConfirmation"
          label={t('form.confirmPassword')}
          placeholder={t('form.confirmPasswordPlaceholder')}
        />
      </View>

      <Button
        testID="change-password-button"
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        title={t('auth.changePassword.submit')}
      />
    </>
  );
};
