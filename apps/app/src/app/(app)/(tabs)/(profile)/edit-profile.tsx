import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useUpdateProfile } from '@/features/auth/hooks/use-update-profile';
import { ControlledTextInput } from '@/shared/components/form/controlled-text-input';
import { Button } from '@/shared/components/ui/button';
import { validateUsername, validateEmail } from '@/lib/zod/zod-predefinitions.helper';
import { ScrollView } from 'react-native';

const editProfileSchema = z.object({
  name: z.string().min(1, { message: 'Campo obrigatório' }),
  username: validateUsername(),
  email: validateEmail(),
});

type EditProfileForm = z.infer<typeof editProfileSchema>;

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const updateProfile = useUpdateProfile();

  const { control, handleSubmit } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data: EditProfileForm) => {
    updateProfile.mutate(data, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="px-4 py-4 gap-6">
      <ControlledTextInput<EditProfileForm> control={control} name="name" label="Nome" testID="edit-profile-name" />

      <ControlledTextInput<EditProfileForm>
        control={control}
        name="username"
        label="Username"
        autoCapitalize="none"
        testID="edit-profile-username"
      />

      <ControlledTextInput<EditProfileForm>
        control={control}
        name="email"
        label="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        testID="edit-profile-email"
      />

      <Button
        title="Salvar"
        onPress={handleSubmit(onSubmit)}
        loading={updateProfile.isPending}
        testID="edit-profile-submit"
      />
    </ScrollView>
  );
}
