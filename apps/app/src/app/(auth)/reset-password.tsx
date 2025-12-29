import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/shared/components/ui/screen';
import { ResetPasswordForm } from '@/features/auth/components';

export default function ResetPasswordScreen() {
  const { token = '' } = useLocalSearchParams<{ token?: string }>();

  return (
    <Screen canGoBack>
      <ResetPasswordForm token={token} />
    </Screen>
  );
}
