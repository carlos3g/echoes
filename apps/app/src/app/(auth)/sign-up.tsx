import { Screen } from '@/shared/components/ui/screen';
import { SignUpForm } from '@/features/auth/components';

export default function SignUpScreen() {
  return (
    <Screen canGoBack scrollable>
      <SignUpForm />
    </Screen>
  );
}
