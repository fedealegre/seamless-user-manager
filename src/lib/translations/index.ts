
import { commonTranslations } from './common';
import { benefitsTranslations } from './benefits';
import { loginTranslations } from './login';
import { paginationTranslations } from './pagination';
import { antiFraudTranslations } from './anti-fraud';

const translations = {
  en: {
    ...commonTranslations.en,
    ...benefitsTranslations.en,
    ...loginTranslations.en,
    ...paginationTranslations.en,
    ...antiFraudTranslations.en,
  },
  es: {
    ...commonTranslations.es,
    ...benefitsTranslations.es,
    ...loginTranslations.es,
    ...paginationTranslations.es,
    ...antiFraudTranslations.es,
  },
};

export const translate = (key: string, language: string = 'en'): string => {
  const lang = language.startsWith('es') ? 'es' : 'en';
  const translation = translations[lang as keyof typeof translations];
  return (translation as any)?.[key] || key;
};
