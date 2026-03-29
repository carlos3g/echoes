import React from 'react';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { createLoginFormSchema } from '@/features/auth/validations';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { useSignIn } from '@/features/auth/hooks/use-sign-in';

type LoginFormData = z.infer<ReturnType<typeof createLoginFormSchema>>;

export const SignInForm: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(createLoginFormSchema()),
    defaultValues: {
      remember: true,
    },
  });

  const { mutate, isPending } = useSignIn();

  const onSubmit = form.handleSubmit((data: LoginFormData) => {
    mutate(data);
  });

  const navigateToForgotPasswordScreen = () => {
    router.push('/(auth)/forgot-password');
  };

  const navigateToSignUpScreen = () => {
    router.push('/(auth)/sign-up');
  };

  return (
    <>
      <Text className="mb-2" variant="headingLarge">
        {t('auth.signIn.greeting')}
      </Text>

      <Text variant="paragraphLarge" className="mb-10">
        {t('auth.signIn.subtitle')}
      </Text>

      <ControlledTextInput
        control={form.control}
        name="email"
        label={t('form.email')}
        placeholder={t('form.emailPlaceholder')}
        boxClassName="mb-5"
        testID="signin-email-input"
      />

      <ControlledPasswordInput
        control={form.control}
        name="password"
        label={t('form.password')}
        placeholder={t('form.passwordPlaceholder')}
        boxClassName="mb-5"
        testID="signin-password-input"
      />

      <Text
        onPress={navigateToForgotPasswordScreen}
        className="text-primary"
        variant="paragraphSmall"
        bold
        testID="go-to-forgot-password-button"
      >
        {t('auth.signIn.forgotPassword')}
      </Text>

      <Button
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        className="mt-12"
        title={t('auth.signIn.submit')}
        testID="signin-button"
      />

      <Button
        onPress={navigateToSignUpScreen}
        variant="outline"
        className="mt-3"
        title={t('auth.signIn.createAccount')}
        testID="go-to-sign-up-button"
      />
    </>
  );
};
