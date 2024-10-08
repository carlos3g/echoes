import type { StateStorage } from 'zustand/middleware';
import { secureStorage, storage } from '@/lib/react-native-mmkv';

export const zustandSecureStateStorage: StateStorage = {
  setItem: (key, value) => {
    return secureStorage.set(key, value);
  },
  getItem: (key) => {
    const value = secureStorage.getString(key);
    return value ?? null;
  },
  removeItem: (key) => {
    return secureStorage.delete(key);
  },
};

export const zustandStateStorage: StateStorage = {
  setItem: (key, value) => {
    return storage.set(key, value);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  removeItem: (key) => {
    return storage.delete(key);
  },
};
