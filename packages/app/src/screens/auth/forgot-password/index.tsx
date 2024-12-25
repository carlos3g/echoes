import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import type { z } from 'zod';
import type { HttpError } from '@/types/http';
import type { ApiResponseError } from '@/types/api';
import { forgotPasswordFormSchema } from '@/features/auth/validations';
import { authService } from '@/features/auth/services';
import type { ForgotPasswordOutput, ForgotPasswordPayload } from '@/features/auth/contracts/auth-service.contract';
import { Screen } from '@/shared/components/ui/screen';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { Button } from '@/shared/components/ui/button';
import { Text } from '@/shared/components/ui/text';

type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

interface ForgotPasswordScreenProps {}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = () => {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {},
  });

  const { mutate, isPending } = useMutation<
    ForgotPasswordOutput,
    HttpError<ApiResponseError<ForgotPasswordPayload>>,
    ForgotPasswordPayload
  >({
    mutationFn: async (payload) => authService.forgotPassword(payload),
    onSuccess: () => {
      toast.success('Confira seu email!', {
        description: 'Um link para redefinir sua senha foi enviado para seu email.',
      });
    },
    onError: () => {
      toast.error('Tivemos um problema!', {
        description: 'Tente novamente ou entre em contato com o suporte.',
      });
    },
  });

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
      />

      <Button loading={isPending} disabled={!form.formState.isValid} onPress={onSubmit} title="Recuperar senha" />
    </Screen>
  );
};
