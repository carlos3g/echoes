import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'storage',
});

export const secureStorage = new MMKV({
  id: 'secure-storage',
  // TO-DO: extract key
  encryptionKey: 'hunter2',
});
