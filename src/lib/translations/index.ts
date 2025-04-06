
import { commonTranslations } from './common';
import { paginationTranslations } from './pagination';
import { transactionTranslations } from './transactions';
import { walletTranslations } from './wallets';
import { userTranslations } from './users';
import { roleTranslations } from './roles';
import { antiFraudTranslations } from './anti-fraud';
import { passwordResetTranslations } from './password-reset';
import { profileTranslations } from './profile';

// Combine all translation modules
const translationModules = [
  commonTranslations,
  paginationTranslations,
  transactionTranslations,
  walletTranslations,
  userTranslations,
  roleTranslations,
  antiFraudTranslations,
  passwordResetTranslations,
  profileTranslations
];

// Build the complete translations object
const buildTranslations = () => {
  const translations: Record<string, Record<string, string>> = {
    en: {},
    es: {}
  };
  
  // Merge all translations from each module
  translationModules.forEach(module => {
    Object.keys(module).forEach(language => {
      translations[language] = {
        ...translations[language],
        ...module[language]
      };
    });
  });
  
  return translations;
};

// The complete translations object
const translations = buildTranslations();

/**
 * Translates a key to the specified language
 * @param key The translation key
 * @param language The target language (defaults to 'en')
 * @returns The translated string or the key itself if no translation is found
 */
export const translate = (key: string, language: string = 'en'): string => {
  // If the key doesn't exist in the selected language, try to get it from English
  if (!translations[language][key] && language !== 'en') {
    return translations['en'][key] || key;
  }

  // Return the translated string or the key itself if no translation is found
  return translations[language][key] || key;
};

export default { translate };
