
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "es";

type TranslationKey = 
  | "dashboard" 
  | "users" 
  | "wallets"
  | "transactions"
  | "antiFraud"
  | "auditLogs"
  | "backofficeOperators"
  | "companySettings"
  | "userFieldSettings"
  | "backofficeSettings"
  | "search"
  | "status"
  | "currency"
  | "balance"
  | "availableBalance"
  | "actions"
  | "viewDetails"
  | "blockWallet"
  | "unblockWallet"
  | "userId"
  | "active"
  | "blocked"
  | "inactive"
  | "save"
  | "cancel"
  | "languageSettings"
  | "selectLanguage"
  | "english"
  | "spanish"
  | "settingsSaved"
  | "total"
  | "activeWallets"
  | "blockedWallets"
  | "topCurrencies"
  | "searchPlaceholder"
  | "noResults"
  | "settings";

type Translations = {
  [key in Language]: {
    [key in TranslationKey]: string;
  };
};

const translations: Translations = {
  en: {
    dashboard: "Dashboard",
    users: "Users",
    wallets: "Wallets",
    transactions: "Transactions",
    antiFraud: "Anti-Fraud Rules",
    auditLogs: "Audit Logs",
    backofficeOperators: "Backoffice Operators",
    companySettings: "Company Settings",
    userFieldSettings: "User Field Settings",
    backofficeSettings: "Backoffice Settings",
    search: "Search",
    status: "Status",
    currency: "Currency",
    balance: "Balance",
    availableBalance: "Available Balance",
    actions: "Actions",
    viewDetails: "View Details",
    blockWallet: "Block Wallet",
    unblockWallet: "Unblock Wallet",
    userId: "User ID",
    active: "Active",
    blocked: "Blocked",
    inactive: "Inactive",
    save: "Save",
    cancel: "Cancel",
    languageSettings: "Language Settings",
    selectLanguage: "Select Language",
    english: "English",
    spanish: "Spanish",
    settingsSaved: "Settings saved successfully",
    total: "Total",
    activeWallets: "Active Wallets",
    blockedWallets: "Blocked Wallets",
    topCurrencies: "Top Currencies",
    searchPlaceholder: "Search wallets...",
    noResults: "No results found",
    settings: "Settings"
  },
  es: {
    dashboard: "Panel de Control",
    users: "Usuarios",
    wallets: "Carteras",
    transactions: "Transacciones",
    antiFraud: "Reglas Anti-Fraude",
    auditLogs: "Registros de Auditoría",
    backofficeOperators: "Operadores de Backoffice",
    companySettings: "Configuración de Empresa",
    userFieldSettings: "Configuración de Campos de Usuario",
    backofficeSettings: "Configuración de Backoffice",
    search: "Buscar",
    status: "Estado",
    currency: "Moneda",
    balance: "Saldo",
    availableBalance: "Saldo Disponible",
    actions: "Acciones",
    viewDetails: "Ver Detalles",
    blockWallet: "Bloquear Cartera",
    unblockWallet: "Desbloquear Cartera",
    userId: "ID de Usuario",
    active: "Activa",
    blocked: "Bloqueada",
    inactive: "Inactiva",
    save: "Guardar",
    cancel: "Cancelar",
    languageSettings: "Configuración de Idioma",
    selectLanguage: "Seleccionar Idioma",
    english: "Inglés",
    spanish: "Español",
    settingsSaved: "Configuración guardada correctamente",
    total: "Total",
    activeWallets: "Carteras Activas",
    blockedWallets: "Carteras Bloqueadas",
    topCurrencies: "Monedas Principales",
    searchPlaceholder: "Buscar carteras...",
    noResults: "No se encontraron resultados",
    settings: "Configuración"
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the language from localStorage or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem("backoffice-language");
    return (savedLanguage as Language) || "en";
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("backoffice-language", language);
  }, [language]);

  // Translation function
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
