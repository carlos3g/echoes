import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { forgotPasswordFormSchema } from '@/features/auth/validations';
import { Screen } from '@/shared/components/ui/screen';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';
import { useForgotPassword } from '@/features/auth/hooks/use-forgot-password';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPasswordScreen() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useForgotPassword();

  const onSubmit = form.handleSubmit((data: ForgotPasswordFormData) => {
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

      <ControlledTextInput
        control={form.control}
        name="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        boxClassName="mb-s-40"
        testID="forgot-password-email-input"
      />

      <Button
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        title="Recuperar senha"
        testID="forgot-password-button"
      />
    </Screen>
  );
}
