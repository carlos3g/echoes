import "server-only";

const dictionaries = {
  pt: () => import("./pt.json").then((m) => m.default),
  en: () => import("./en.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["pt"]>>;

export const locales: Locale[] = ["pt", "en"];
export const defaultLocale: Locale = "pt";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
