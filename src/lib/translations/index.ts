
import { commonTranslations } from './common';
import { benefitsTranslations } from './benefits';

const translations = {
  en: {
    ...commonTranslations.en,
    ...benefitsTranslations.en,
  },
  es: {
    ...commonTranslations.es,
    ...benefitsTranslations.es,
  },
};

export const translate = (key: string, language: string = 'en'): string => {
  const lang = language.startsWith('es') ? 'es' : 'en';
  const translation = translations[lang as keyof typeof translations];
  return (translation as any)?.[key] || key;
};
