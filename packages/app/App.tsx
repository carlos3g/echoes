import '@/lib/i18n';
import '@/shared/services';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import './global.css';

import { useReactQueryDevTools } from '@dev-plugins/react-query';
import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
  useFonts,
} from '@expo-google-fonts/poppins';
import * as Sentry from '@sentry/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { useMMKVDevTools } from '@dev-plugins/react-native-mmkv';
import { LogBox } from 'react-native';
import { navigationIntegration, RootNavigator } from '@/navigation';
import { queryClient, useFocusManager } from '@/lib/react-query';
import { ThemeProvider } from '@/lib/nativewind/theme.context';
import { AuthProvider } from '@/features/auth/contexts/auth.context';

LogBox.ignoreLogs(['ProgressiveListView: `ref` is not a prop.']);

void SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_PROJECT_DSN,
  sendDefaultPii: true,
  tracesSampleRate: 0.3,
  integrations: [navigationIntegration],
  debug: false,
});

const App = () => {
  const [loaded, error] = useFonts({
    'Poppins-Thin': Poppins_100Thin,
    'Poppins-ThinItalic': Poppins_100Thin_Italic,
    'Poppins-ExtraLight': Poppins_200ExtraLight,
    'Poppins-ExtraLightItalic': Poppins_200ExtraLight_Italic,
    'Poppins-Light': Poppins_300Light,
    'Poppins-LightItalic': Poppins_300Light_Italic,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-RegularItalic': Poppins_400Regular_Italic,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-MediumItalic': Poppins_500Medium_Italic,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-SemiBoldItalic': Poppins_600SemiBold_Italic,
    'Poppins-Bold': Poppins_700Bold,
    'Poppins-BoldItalic': Poppins_700Bold_Italic,
    'Poppins-ExtraBold': Poppins_800ExtraBold,
    'Poppins-ExtraBoldItalic': Poppins_800ExtraBold_Italic,
    'Poppins-Black': Poppins_900Black,
    'Poppins-BlackItalic': Poppins_900Black_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useReactQueryDevTools(queryClient);
  useMMKVDevTools();
  useFocusManager();

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <RootNavigator />

            <Toaster autoWiggleOnUpdate="always" />
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default gestureHandlerRootHOC(Sentry.wrap(App));
