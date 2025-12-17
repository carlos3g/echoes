import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import type { z } from 'zod';
import { changePasswordFormSchema } from '@/features/auth/validations';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import { Button } from '@/shared/components/ui/button';
import { useChangePassword } from '@/features/auth/hooks/use-change-password';

type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;

export default function ChangePasswordScreen() {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const { mutate, isPending } = useChangePassword();

  const onSubmit = form.handleSubmit((data: ChangePasswordFormData) => {
    mutate(data);
  });

  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
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
    </ScrollView>
  );
}
