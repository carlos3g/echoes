import { create } from 'zustand';
import { storage } from '@/lib/react-native-mmkv';
import { LANGUAGE_STORAGE_KEY } from '@/lib/i18n';

export type AppLanguage = 'pt' | 'en';

interface LanguageState {
  language: AppLanguage | null;
  setLanguage: (language: AppLanguage) => void;
}

function getStoredLanguage(): AppLanguage | null {
  const value = storage.getString(LANGUAGE_STORAGE_KEY);
  if (value === 'pt' || value === 'en') return value;
  return null;
}

export const useLanguageStore = create<LanguageState>()((set) => ({
  language: getStoredLanguage(),
  setLanguage: (language) => {
    storage.set(LANGUAGE_STORAGE_KEY, language);
    set({ language });
  },
}));
