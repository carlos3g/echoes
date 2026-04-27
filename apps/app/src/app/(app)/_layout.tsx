import { Stack } from 'expo-router';
import { useSessionTracker } from '@/features/session/hooks/use-session-tracker';

export default function AppLayout() {
  useSessionTracker();

  return <Stack screenOptions={{ headerShown: false }} />;
}
