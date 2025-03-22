import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { loginFormSchema } from '@/features/auth/validations';
import { Screen } from '@/shared/components/ui/screen';
import type { AuthStackNavigationProp, AuthStackScreenProps } from '@/navigation/auth.navigator.types';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { useSignIn } from '@/features/auth/hooks/use-sign-in';

type LoginFormData = z.infer<typeof loginFormSchema>;

export const SignInScreen: React.FC<AuthStackScreenProps<'SignInScreen'>> = () => {
  const { navigate } = useNavigation<AuthStackNavigationProp<'SignInScreen'>>();

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
    navigate('ForgotPasswordScreen');
  };

  const navigateToSignUpScreen = () => {
    navigate('SignUpScreen');
  };

  return (
    <Screen scrollable>
      <Text className="mb-s-8" variant="headingLarge">
        Olá
      </Text>

      <Text variant="paragraphLarge" className="mb-s-40">
        Digite seu e-mail e senha para entrar
      </Text>

      <ControlledTextInput
        control={form.control}
        name="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        boxClassName="mb-s-20"
        testID="signin-email-input"
      />

      <ControlledPasswordInput
        control={form.control}
        name="password"
        label="Senha"
        placeholder="Digite sua senha"
        boxClassName="mb-s-20"
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
        className="mt-s-48"
        title="Entrar"
        testID="signin-button"
      />

      <Button
        onPress={navigateToSignUpScreen}
        variant="outline"
        className="mt-s-12"
        title="Criar conta"
        testID="go-to-sign-up-button"
      />
    </Screen>
  );
};
