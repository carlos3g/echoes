import { Screen } from '@/shared/components/ui/screen';
import { ForgotPasswordForm } from '@/features/auth/components';

export default function ForgotPasswordScreen() {
  return (
    <Screen canGoBack>
      <ForgotPasswordForm />
    </Screen>
  );
}
