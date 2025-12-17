import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/features/auth/hooks/use-auth';

export default function AuthLayout() {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Redirect href="/(app)/(tabs)/(quotes)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
