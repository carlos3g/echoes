import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Echoes',
  slug: 'echoes',
  scheme: 'echoes',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'automatic',
  experiments: {
    reactCompiler: true,
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.carlos3g.echoes',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
      monochromeImage: './src/assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.carlos3g.echoes',
  },
  web: {
    favicon: './src/assets/favicon.png',
    bundler: 'metro',
  },
  newArchEnabled: true,
  plugins: [
    'expo-router',
    'expo-font',
    'expo-build-properties',
    [
      '@sentry/react-native/expo',
      {
        organization: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        url: 'https://sentry.io/',
      },
    ],
    [
      'react-native-share',
      {
        ios: ['fb', 'instagram', 'twitter', 'tiktoksharesdk'],
        android: ['com.facebook.katana', 'com.instagram.android', 'com.twitter.android', 'com.zhiliaoapp.musically'],
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#fff',
        image: './src/assets/splash-icon.png',
        dark: {
          image: './src/assets/splash-icon-dark.png',
          backgroundColor: '#000',
        },
        imageWidth: 200,
      },
    ],
  ],
});
