import React from 'react';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { loginFormSchema } from '@/features/auth/validations';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { useSignIn } from '@/features/auth/hooks/use-sign-in';

type LoginFormData = z.infer<typeof loginFormSchema>;

export const SignInForm: React.FC = () => {
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
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
        Olá
      </Text>

      <Text variant="paragraphLarge" className="mb-10">
        Digite seu e-mail e senha para entrar
      </Text>

      <ControlledTextInput
        control={form.control}
        name="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        boxClassName="mb-5"
        testID="signin-email-input"
      />

      <ControlledPasswordInput
        control={form.control}
        name="password"
        label="Senha"
        placeholder="Digite sua senha"
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
        Esqueci minha senha
      </Text>

      <Button
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        className="mt-12"
        title="Entrar"
        testID="signin-button"
      />

      <Button
        onPress={navigateToSignUpScreen}
        variant="outline"
        className="mt-3"
        title="Criar conta"
        testID="go-to-sign-up-button"
      />
    </>
  );
};
