import React from 'react';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { createSignUpFormSchema } from '@/features/auth/validations';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { useSignUp } from '@/features/auth/hooks/use-sign-up';

type SignUpFormData = z.infer<ReturnType<typeof createSignUpFormSchema>>;

export const SignUpForm: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(createSignUpFormSchema()),
    defaultValues: {
      acceptTerms: true,
    },
    mode: 'onChange',
  });

  const { mutate, isPending } = useSignUp({
    onSuccess: () => {
      router.push('/(auth)/sign-in');
    },
  });

  const onSubmit = form.handleSubmit((data: SignUpFormData) => {
    mutate(data);
  });

  return (
    <>
      <Text variant="headingLarge" className="mb-8">
        {t('auth.signUp.title')}
      </Text>

      <View className="mb-5 gap-5">
        <ControlledTextInput
          testID="signup-name-input"
          control={form.control}
          name="name"
          label={t('form.name')}
          placeholder={t('form.namePlaceholder')}
        />
        <ControlledTextInput
          testID="signup-username-input"
          control={form.control}
          name="username"
          label={t('form.username')}
          placeholder={t('form.usernamePlaceholder')}
        />
        <ControlledTextInput
          testID="signup-email-input"
          control={form.control}
          name="email"
          label={t('form.email')}
          placeholder={t('form.emailPlaceholder')}
        />
        <ControlledPasswordInput
          testID="signup-password-input"
          control={form.control}
          name="password"
          label={t('form.password')}
          placeholder={t('form.passwordPlaceholder')}
        />
        <ControlledPasswordInput
          testID="signup-password-confirmation-input"
          control={form.control}
          name="passwordConfirmation"
          label={t('form.confirmPassword')}
          placeholder={t('form.confirmPasswordPlaceholder')}
        />
      </View>

      <Button
        testID="signup-button"
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        title={t('auth.signUp.submit')}
      />
    </>
  );
};
