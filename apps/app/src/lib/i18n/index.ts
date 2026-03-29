import 'intl-pluralrules';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import zodPt from 'zod-i18n-map/locales/pt/zod.json';
import zodEn from 'zod-i18n-map/locales/en/zod.json';
import pt from './locales/pt.json';
import en from './locales/en.json';
import type { AppLanguage } from '@/lib/zustand/stores/language.store';

export const LANGUAGE_STORAGE_KEY = 'app-language';

function getDeviceLanguage(): AppLanguage {
  const locale = getLocales()[0]?.languageCode;
  return locale === 'pt' ? 'pt' : 'en';
}

function getStoredLanguage(): AppLanguage | null {
  try {
    const value = require('@/lib/react-native-mmkv').storage.getString(LANGUAGE_STORAGE_KEY);
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
    pt: { translation: pt, zod: zodPt },
    en: { translation: en, zod: zodEn },
  },
  interpolation: {
    escapeValue: false,
  },
});

z.setErrorMap(zodI18nMap);

export default i18next;
