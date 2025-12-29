import { Screen } from '@/shared/components/ui/screen';
import { SignInForm } from '@/features/auth/components';

export default function SignInScreen() {
  return (
    <Screen scrollable>
      <SignInForm />
    </Screen>
  );
}
