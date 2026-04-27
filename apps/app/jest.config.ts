import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/src/test/jest-setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/test/jest-setup-after-env.ts'],
  moduleDirectories: ['node_modules', './src/test'],
  modulePathIgnorePatterns: ['.*/mockedData/.*'],
  // react-native-css-interop only lands in apps/app/node_modules under our Yarn 4 hoisting
  // strategy, but expo-modules-core (at root node_modules) imports its jsx-runtime. Map it
  // explicitly so Jest can resolve it from the app workspace.
  moduleNameMapper: {
    '^react-native-css-interop/jsx-runtime$':
      '<rootDir>/node_modules/react-native-css-interop/dist/runtime/jsx-runtime.js',
    '^react-native-css-interop/jsx-dev-runtime$':
      '<rootDir>/node_modules/react-native-css-interop/dist/runtime/jsx-dev-runtime.js',
  },
  testTimeout: 15000,
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx,js,jsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/expo-env.d.ts',
    '!**/.expo/**',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|expo-router|@sentry/react-native|native-base|react-native-svg)',
  ],
};

export default config;
