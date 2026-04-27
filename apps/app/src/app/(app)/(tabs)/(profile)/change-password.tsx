import { ScrollView } from 'react-native';
import { ChangePasswordForm } from '@/features/auth/components';

export default function ChangePasswordScreen() {
  return (
    <ScrollView className="flex-1 bg-background px-4 py-6">
      <ChangePasswordForm />
    </ScrollView>
  );
}
