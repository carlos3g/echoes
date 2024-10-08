import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import type { z } from 'zod';
import type { ResetPasswordOutput, ResetPasswordPayload } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import { resetPasswordFormSchema } from '@/features/auth/validations';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { Box } from '@/shared/components/ui/box';
import { Button } from '@/shared/components/ui/button';
import { Screen } from '@/shared/components/ui/screen';
import { Text } from '@/shared/components/ui/text';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';

type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

interface ResetPasswordScreenProps {}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = () => {
  const token = '';

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token,
    },
  });

  const { mutate, status } = useMutation<
    ResetPasswordOutput,
    HttpError<ApiResponseError<ResetPasswordPayload>>,
    ResetPasswordPayload
  >({
    mutationFn: async (payload) => authService.resetPassword(payload),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!', {
        description: 'Faca login com sua nova senha',
      });
    },
    onError: () => {
      toast.error('Tivemos um problema!', {
        description: 'Tente novamente ou entre em contato com o suporte.',
      });
    },
  });

  const onSubmit = form.handleSubmit((data: ResetPasswordFormData) => {
    mutate(data);
  });

  const isLoading = status === 'pending';

  return (
    <Screen canGoBack>
      <Text preset="headingLarge" mb="s16">
        Esqueci minha senha
      </Text>
      <Text preset="paragraphLarge" mb="s32">
        Digite seu e-mail e enviaremos as instruções para redefinição de senha
      </Text>

      <Box gap="s20" mb="s40">
        <ControlledTextInput control={form.control} name="email" label="E-mail" placeholder="Digite seu e-mail" />
        <ControlledPasswordInput control={form.control} name="password" label="Senha" placeholder="Digite sua senha" />
        <ControlledPasswordInput
          control={form.control}
          name="passwordConfirmation"
          label="Confirmar senha"
          placeholder="Digite a mesma senha"
        />
      </Box>

      <Button loading={isLoading} disabled={!form.formState.isValid} onPress={onSubmit} title="Redefinir senha" />
    </Screen>
  );
};
