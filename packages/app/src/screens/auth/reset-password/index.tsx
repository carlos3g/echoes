import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { View } from 'react-native';
import { resetPasswordFormSchema } from '@/features/auth/validations';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { Button } from '@/shared/components/ui/button';
import { Screen } from '@/shared/components/ui/screen';
import { Text } from '@/shared/components/ui/text';
import type { AuthStackScreenProps } from '@/navigation/auth.navigator.types';
import { useResetPassword } from '@/features/auth/hooks/use-reset-password';

type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

export const ResetPasswordScreen: React.FC<AuthStackScreenProps<'ResetPasswordScreen'>> = () => {
  const token = '';

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token,
    },
  });

  const { mutate, isPending } = useResetPassword();

  const onSubmit = form.handleSubmit((data: ResetPasswordFormData) => {
    mutate(data);
  });

  return (
    <Screen canGoBack>
      <Text variant="headingLarge" className="mb-s-16">
        Esqueci minha senha
      </Text>
      <Text variant="paragraphLarge" className="mb-s-32">
        Digite seu e-mail e enviaremos as instruções para redefinição de senha
      </Text>

      <View className="mb-s-40 gap-s-20">
        <ControlledTextInput control={form.control} name="email" label="E-mail" placeholder="Digite seu e-mail" />
        <ControlledPasswordInput control={form.control} name="password" label="Senha" placeholder="Digite sua senha" />
        <ControlledPasswordInput
          control={form.control}
          name="passwordConfirmation"
          label="Confirmar senha"
          placeholder="Digite a mesma senha"
        />
      </View>

      <Button loading={isPending} disabled={!form.formState.isValid} onPress={onSubmit} title="Redefinir senha" />
    </Screen>
  );
};
