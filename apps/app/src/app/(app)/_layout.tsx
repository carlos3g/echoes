import { Redirect, Slot } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function AppLayout() {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return <Slot />;
}
