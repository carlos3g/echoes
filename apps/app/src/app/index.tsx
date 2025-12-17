import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function Index() {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Redirect href="/(app)/(tabs)/(quotes)" />;
  }

  return <Redirect href="/(auth)/sign-in" />;
}
