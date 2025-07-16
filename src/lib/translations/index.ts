import { commonTranslations } from './common';
import { benefitsTranslations } from './benefits';
import { dashboardTranslations } from './dashboard';
import { usersTranslations } from './users';
import { transactionsTranslations } from './transactions';
import { walletsTranslations } from './wallets';
import { antiFraudTranslations } from './antiFraud';
import { auditLogsTranslations } from './auditLogs';
import { backofficeOperatorsTranslations } from './backofficeOperators';
import { companySettingsTranslations } from './companySettings';
import { userFieldSettingsTranslations } from './userFieldSettings';
import { backofficeSettingsTranslations } from './backofficeSettings';
import { myProfileTranslations } from './myProfile';
import { notFoundTranslations } from './notFound';

const translations = {
  en: {
    ...commonTranslations.en,
    ...benefitsTranslations.en,
    ...dashboardTranslations.en,
    ...usersTranslations.en,
    ...transactionsTranslations.en,
    ...walletsTranslations.en,
    ...antiFraudTranslations.en,
    ...auditLogsTranslations.en,
    ...backofficeOperatorsTranslations.en,
    ...companySettingsTranslations.en,
    ...userFieldSettingsTranslations.en,
    ...backofficeSettingsTranslations.en,
    ...myProfileTranslations.en,
    ...notFoundTranslations.en,
  },
  es: {
    ...commonTranslations.es,
    ...benefitsTranslations.es,
    ...dashboardTranslations.es,
    ...usersTranslations.es,
    ...transactionsTranslations.es,
    ...walletsTranslations.es,
    ...antiFraudTranslations.es,
    ...auditLogsTranslations.es,
    ...backofficeOperatorsTranslations.es,
    ...companySettingsTranslations.es,
    ...userFieldSettingsTranslations.es,
    ...backofficeSettingsTranslations.es,
    ...myProfileTranslations.es,
    ...notFoundTranslations.es,
  },
};

export const translate = (key: string, language: string = 'en'): string => {
  const lang = language.startsWith('es') ? 'es' : 'en';
  const translation = translations[lang as keyof typeof translations];
  return (translation as any)?.[key] || key;
};
