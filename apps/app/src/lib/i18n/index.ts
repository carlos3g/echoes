import 'intl-pluralrules';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import * as z from 'zod';
import pt from './locales/pt.json';
import en from './locales/en.json';
import { zodErrorMap } from './zod-error-map';
import type { AppLanguage } from '@/lib/zustand/stores/language.store';

export const LANGUAGE_STORAGE_KEY = 'app-language';

function getDeviceLanguage(): AppLanguage {
  const locale = getLocales()[0]?.languageCode;
  return locale === 'pt' ? 'pt' : 'en';
}

function getStoredLanguage(): AppLanguage | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mmkv = require('@/lib/react-native-mmkv') as { storage: { getString: (key: string) => string | undefined } };
    const value = mmkv.storage.getString(LANGUAGE_STORAGE_KEY);
    if (value === 'pt' || value === 'en') return value;
  } catch {
    // storage not ready
  }
  return null;
}

const initialLanguage = getStoredLanguage() ?? getDeviceLanguage();

void i18next.use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: 'en',
  resources: {
    pt: { translation: pt },
    en: { translation: en },
  },
  interpolation: {
    escapeValue: false,
  },
});

z.config({ customError: zodErrorMap });

export default i18next;
