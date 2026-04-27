import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { createForgotPasswordFormSchema } from '@/features/auth/validations';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { useForgotPassword } from '@/features/auth/hooks/use-forgot-password';

type ForgotPasswordFormData = z.infer<ReturnType<typeof createForgotPasswordFormSchema>>;

export const ForgotPasswordForm: React.FC = () => {
  const { t } = useTranslation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(createForgotPasswordFormSchema()),
    defaultValues: {},
  });

  const { mutate, isPending } = useForgotPassword();

  const onSubmit = form.handleSubmit((data: ForgotPasswordFormData) => {
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

      <ControlledTextInput
        control={form.control}
        name="email"
        label={t('form.email')}
        placeholder={t('form.emailPlaceholder')}
        boxClassName="mb-10"
        testID="forgot-password-email-input"
      />

      <Button
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        title={t('auth.forgotPassword.submit')}
        testID="forgot-password-button"
      />
    </>
  );
};
