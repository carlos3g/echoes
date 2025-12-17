import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          color: colors.lightTheme.backgroundContrast,
        },
        contentStyle: {
          borderTopColor: '#C2C2C2',
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
