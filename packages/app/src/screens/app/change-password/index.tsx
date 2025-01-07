import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { toast } from 'sonner-native';
import type { z } from 'zod';
import type { ChangePasswordOutput, ChangePasswordPayload } from '@/features/auth/contracts/auth-service.contract';
import { authService } from '@/features/auth/services';
import { changePasswordFormSchema } from '@/features/auth/validations';
import type { SettingsStackScreenProps } from '@/navigation/settings.navigator.types';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { Button } from '@/shared/components/ui/button';
import { Screen } from '@/shared/components/ui/screen';
import type { ApiResponseError } from '@/types/api';
import type { HttpError } from '@/types/http';

type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

interface ChangePasswordScreenProps extends SettingsStackScreenProps<'ChangePasswordScreen'> {}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = () => {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const { mutate, isPending } = useMutation<
    ChangePasswordOutput,
    HttpError<ApiResponseError<ChangePasswordPayload>>,
    ChangePasswordPayload
  >({
    mutationFn: async (payload) => authService.changePassword(payload),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!');
    },
    onError: () => {
      toast.error('Não foi possível alterar a senha!', {
        description: 'Talvez você digitou a senha atual incorretamente?',
      });
    },
  });

  const onSubmit = form.handleSubmit((data: ChangePasswordFormData) => {
    mutate(data);
  });

  return (
    <Screen scrollable className="py-4">
      <View className="mb-s-20 gap-s-20">
        <ControlledPasswordInput
          testID="current-password-input"
          control={form.control}
          name="currentPassword"
          label="Senha atual"
          placeholder="Digite sua senha atual"
        />
        <ControlledPasswordInput
          testID="new-password-input"
          control={form.control}
          name="password"
          label="Senha nova"
          placeholder="Digite sua nova senha"
        />
        <ControlledPasswordInput
          testID="new-password-confirmation-input"
          control={form.control}
          name="passwordConfirmation"
          label="Confirmar senha"
          placeholder="Digite a mesma senha"
        />
      </View>

      <Button
        testID="change-password-button"
        loading={isPending}
        disabled={!form.formState.isValid}
        onPress={onSubmit}
        title="Alterar senha"
      />
    </Screen>
  );
};
