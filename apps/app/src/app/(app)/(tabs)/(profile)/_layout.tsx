import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/lib/nativewind/theme.context';

export default function ProfileLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          color: colors.foreground,
          fontFamily: 'DMSans-SemiBold',
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
      <Stack.Screen name="index" options={{ title: t('profile.title') }} />
      <Stack.Screen name="edit-profile" options={{ title: t('profile.editProfile') }} />
      <Stack.Screen name="change-password" options={{ title: t('profile.changePassword') }} />
      <Stack.Screen name="reading-preferences" options={{ title: t('profile.readingPreferences') }} />
    </Stack>
  );
}
