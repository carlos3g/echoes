// see: https://github.com/expo/router/issues/41#issuecomment-2079402723
// this file is the only way I found to make expo-router work with turborepo

import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Must be exported or Fast Refresh won't update the context
export const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const ctx = require.context('./src/app'); //Path with src folder
  // eslint-disable-next-line react/jsx-filename-extension, @typescript-eslint/no-unsafe-assignment
  return <ExpoRoot context={ctx} />;
};

registerRootComponent(App);
