import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { createResetPasswordFormSchema } from '@/features/auth/validations';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { useResetPassword } from '@/features/auth/hooks/use-reset-password';

type ResetPasswordFormData = z.infer<ReturnType<typeof createResetPasswordFormSchema>>;

interface ResetPasswordFormProps {
  token: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const { t } = useTranslation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(createResetPasswordFormSchema()),
    defaultValues: {
      token,
    },
  });

  const { mutate, isPending } = useResetPassword();

  const onSubmit = form.handleSubmit((data: ResetPasswordFormData) => {
    mutate(data);
  });

  return (
    <>
      <Text variant="headingLarge" className="mb-4">
        {t('auth.forgotPassword.title')}
      </Text>
      <Text variant="paragraphLarge" className="mb-8">
        {t('auth.forgotPassword.subtitle')}
      </Text>

      <View className="mb-10 gap-5">
        <ControlledTextInput
          control={form.control}
          name="email"
          label={t('form.email')}
          placeholder={t('form.emailPlaceholder')}
          testID="reset-password-email-input"
        />
        <ControlledPasswordInput
          control={form.control}
          name="password"
          label={t('form.password')}
          placeholder={t('form.passwordPlaceholder')}
          testID="reset-password-password-input"
        />
        <ControlledPasswordInput
          control={form.control}
          name="passwordConfirmation"
          label={t('form.confirmPassword')}
          placeholder={t('form.confirmPasswordPlaceholder')}
          testID="reset-password-confirmation-input"
        />
      </View>

      <Button
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        title={t('auth.resetPassword.submit')}
        testID="reset-password-button"
      />
    </>
  );
};
