import '@/lib/i18n';
import '@/shared/services';
import '../global.css';

import { AuthProvider } from '@/features/auth/contexts/auth.context';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ThemeProvider } from '@/lib/nativewind/theme.context';
import { storage } from '@/lib/react-native-mmkv';
import { queryClient, useFocusManager } from '@/lib/react-query';
import { useMMKVDevTools } from '@dev-plugins/react-native-mmkv';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import {
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_600SemiBold,
  DMSans_600SemiBold_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_500Medium_Italic,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_600SemiBold_Italic,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import { Lora_400Regular, Lora_400Regular_Italic } from '@expo-google-fonts/lora';
import { Merriweather_400Regular, Merriweather_400Regular_Italic } from '@expo-google-fonts/merriweather';
import { CrimsonText_400Regular, CrimsonText_400Regular_Italic } from '@expo-google-fonts/crimson-text';
import { useFonts } from 'expo-font';
import * as Sentry from '@sentry/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Stack, useNavigationContainerRef, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { ErrorBoundary } from '@/shared/components/error-boundary';

LogBox.ignoreLogs(['ProgressiveListView: `ref` is not a prop.']);

void SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

const routingInstrumentation = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_PROJECT_DSN,
  sendDefaultPii: true,
  tracesSampleRate: 0.3,
  enableLogs: true,
  profilesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [Sentry.mobileReplayIntegration(), routingInstrumentation],
  debug: false,
});

const RootLayoutNav = () => {
  const ref = useNavigationContainerRef();
  const { isAuth } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  const inAuthGroup = segments[0] === '(auth)';

  if (!isAuth && !inAuthGroup) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (isAuth && inAuthGroup) {
    return <Redirect href="/(app)/(tabs)/(explore)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
};

const RootLayout = () => {
  const [loaded, error] = useFonts({
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Italic': DMSans_400Regular_Italic,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-MediumItalic': DMSans_500Medium_Italic,
    'DMSans-SemiBold': DMSans_600SemiBold,
    'DMSans-SemiBoldItalic': DMSans_600SemiBold_Italic,
    'DMSans-Bold': DMSans_700Bold,
    'DMSans-BoldItalic': DMSans_700Bold_Italic,
    'PlayfairDisplay-Regular': PlayfairDisplay_400Regular,
    'PlayfairDisplay-Italic': PlayfairDisplay_400Regular_Italic,
    'PlayfairDisplay-Medium': PlayfairDisplay_500Medium,
    'PlayfairDisplay-MediumItalic': PlayfairDisplay_500Medium_Italic,
    'PlayfairDisplay-SemiBold': PlayfairDisplay_600SemiBold,
    'PlayfairDisplay-SemiBoldItalic': PlayfairDisplay_600SemiBold_Italic,
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    'PlayfairDisplay-BoldItalic': PlayfairDisplay_700Bold_Italic,
    'Lora-Regular': Lora_400Regular,
    'Lora-Italic': Lora_400Regular_Italic,
    'Merriweather-Regular': Merriweather_400Regular,
    'Merriweather-Italic': Merriweather_400Regular_Italic,
    'CrimsonText-Regular': CrimsonText_400Regular,
    'CrimsonText-Italic': CrimsonText_400Regular_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useReactQueryDevTools(queryClient);
  useMMKVDevTools({ storage });
  useFocusManager();

  if (!loaded && !error) {
    return null;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <AuthProvider>
              <ThemeProvider>
                <Host>
                  <RootLayoutNav />
                </Host>
                <Toaster autoWiggleOnUpdate="always" />
              </ThemeProvider>
            </AuthProvider>
          </SafeAreaProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
};

export default Sentry.wrap(RootLayout);
