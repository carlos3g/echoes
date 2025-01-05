import type { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { toast } from 'sonner-native';
import { View } from 'react-native';
import { signUpFormSchema } from '@/features/auth/validations';
import type { SignUpOutput, SignUpPayload } from '@/features/auth/contracts/auth-service.contract';
import type { HttpError } from '@/types/http';
import type { ApiResponseError } from '@/types/api';
import { authService } from '@/features/auth/services';
import { Screen } from '@/shared/components/ui/screen';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { ControlledPasswordInput } from '@/shared/components/form/controlled-password-input';
import type { AuthStackNavigationProp, AuthStackScreenProps } from '@/navigation/auth.navigator.types';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';

type SignUpFormData = z.infer<typeof signUpFormSchema>;

interface SignUpScreenProps extends AuthStackScreenProps<'SignUpScreen'> {}

export const SignUpScreen: React.FC<SignUpScreenProps> = () => {
  const { navigate } = useNavigation<AuthStackNavigationProp<'SignUpScreen'>>();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      acceptTerms: true,
    },
    mode: 'onChange',
  });

  const { mutate, isPending } = useMutation<SignUpOutput, HttpError<ApiResponseError<SignUpPayload>>, SignUpPayload>({
    mutationFn: async (payload) => authService.signUp(payload),
    onSuccess: () => {
      navigate('SignInScreen');
    },
    onError: () => {
      toast.error('Tivemos um problema!', {
        description: 'Tente novamente ou entre em contato com o suporte.',
      });
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
};
