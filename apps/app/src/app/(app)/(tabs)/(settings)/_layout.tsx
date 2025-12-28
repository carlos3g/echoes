import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/lib/nativewind/theme.context';

export default function SettingsLayout() {
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
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Configurações',
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: 'Alterar senha',
        }}
      />
    </Stack>
  );
}
