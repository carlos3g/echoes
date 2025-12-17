import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { signUpFormSchema } from '@/features/auth/validations';
import { Screen } from '@/shared/components/ui/screen';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { useSignUp } from '@/features/auth/hooks/use-sign-up';

type SignUpFormData = z.infer<typeof signUpFormSchema>;

export default function SignUpScreen() {
  const router = useRouter();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
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
    <Screen canGoBack scrollable>
      <Text variant="headingLarge" className="mb-s-32">
        Criar nova conta
      </Text>

      <View className="mb-s-20 gap-s-20">
        <ControlledTextInput
          testID="signup-name-input"
          control={form.control}
          name="name"
          label="Nome"
          placeholder="Digite seu nome"
        />
        <ControlledTextInput
          testID="signup-username-input"
          control={form.control}
          name="username"
          label="Username"
          placeholder="Escolha um username"
        />
        <ControlledTextInput
          testID="signup-email-input"
          control={form.control}
          name="email"
          label="E-mail"
          placeholder="Digite seu e-mail"
        />
        <ControlledPasswordInput
          testID="signup-password-input"
          control={form.control}
          name="password"
          label="Senha"
          placeholder="Digite sua senha"
        />
        <ControlledPasswordInput
          testID="signup-password-confirmation-input"
          control={form.control}
          name="passwordConfirmation"
          label="Confirmar senha"
          placeholder="Digite a mesma senha"
        />
      </View>

      <Button
        testID="signup-button"
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        title="Criar conta"
      />
    </Screen>
  );
}
