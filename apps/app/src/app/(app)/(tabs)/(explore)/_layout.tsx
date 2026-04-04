import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/lib/nativewind/theme.context';

export default function ExploreLayout() {
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
      <Stack.Screen name="index" options={{ title: t('tabs.explore') }} />
      <Stack.Screen name="quote/[quoteUuid]" options={{ title: t('quote.title') }} />
      <Stack.Screen name="author/[authorUuid]" options={{ title: t('author.title') }} />
      <Stack.Screen name="folder/[folderUuid]" options={{ title: t('folder.title') }} />
      <Stack.Screen name="folder/search" options={{ title: t('folder.searchTitle') }} />
      <Stack.Screen name="folder/popular" options={{ title: t('folder.popularTitle') }} />
      <Stack.Screen name="folder/user-[username]" options={{ title: t('folder.userFoldersTitle') }} />
      <Stack.Screen name="folder/members" options={{ title: t('folder.membersTitle') }} />
    </Stack>
  );
}
