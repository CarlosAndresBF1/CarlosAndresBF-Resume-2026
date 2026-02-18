import en from "./en.json";
import es from "./es.json";

export const languages = { en, es } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = "es";

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split("/");
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return languages[lang];
}

export function getLocalizedPath(lang: Lang, path: string = "") {
  return `/${lang}${path ? `/${path}` : ""}`;
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === "en" ? "es" : "en";
}
