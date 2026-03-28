import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/lib/nativewind/theme.context';

export default function AuthorsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          color: colors.foreground,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        contentStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Autores' }} />
      <Stack.Screen name="[authorUuid]" options={{ title: '' }} />
    </Stack>
  );
}
