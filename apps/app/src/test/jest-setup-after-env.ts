import '@testing-library/react-native';

// Force-load expo's lazy WinterCG globals during setup. Without this, Jest tries to load
// them on first access — sometimes during teardown, when `isInsideTestCode === false`,
// which triggers `ReferenceError: You are trying to import a file outside of the scope`.
// Touching each global here pulls the lazy `require` into the in-test code window.
/* eslint-disable @typescript-eslint/no-unused-expressions */
void global.TextDecoder;
void global.URL;
void global.URLSearchParams;
void global.structuredClone;
void (global as { __ExpoImportMetaRegistry?: unknown }).__ExpoImportMetaRegistry;
/* eslint-enable @typescript-eslint/no-unused-expressions */

// In jest, expo-localization returns no locales by default, so i18n falls back to 'en'.
// Force PT for tests that assert Portuguese error messages from i18next.t(...).
jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'pt', regionCode: 'BR' }],
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    setParams: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: () => ({}),
  useGlobalSearchParams: () => ({}),
  usePathname: () => '/',
  useSegments: () => [],
  useFocusEffect: jest.fn(),
  Link: ({ children }: { children: React.ReactNode }) => children,
  Redirect: () => null,
  Stack: {
    Screen: () => null,
  },
  Tabs: {
    Screen: () => null,
  },
  useNavigationContainerRef: () => ({ current: null }),
}));
