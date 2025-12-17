import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'storage',
});

export const secureStorage = createMMKV({
  id: 'secure-storage',
  // TO-DO: extract key
  encryptionKey: 'hunter2',
});
