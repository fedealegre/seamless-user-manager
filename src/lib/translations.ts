
import { Language } from "@/contexts/BackofficeSettingsContext";

// Define translation keys and their values
interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

// Translations dictionary
const translations: Translations = {
  // Common
  "dashboard": {
    en: "Dashboard",
    es: "Panel de control"
  },
  "users": {
    en: "User Management",
    es: "Gestión de usuarios"
  },
  "wallets": {
    en: "Wallets",
    es: "Billeteras"
  },
  "transactions": {
    en: "Transactions",
    es: "Transacciones"
  },
  "anti-fraud": {
    en: "Anti-Fraud Rules",
    es: "Reglas Anti-Fraude"
  },
  "audit-logs": {
    en: "Audit Logs",
    es: "Registros de auditoría"
  },
  "backoffice-operators": {
    en: "Backoffice Operators",
    es: "Operadores de Back Office"
  },
  "company-settings": {
    en: "Company Settings",
    es: "Configuración de la empresa"
  },
  "user-field-settings": {
    en: "User Field Settings",
    es: "Configuración de campos de usuario"
  },
  "backoffice-settings": {
    en: "Backoffice Settings",
    es: "Configuración del Back Office"
  },
  
  // Settings page
  "language": {
    en: "Language",
    es: "Idioma"
  },
  "language-description": {
    en: "Select the language for the backoffice interface",
    es: "Seleccione el idioma para la interfaz del back office"
  },
  "select-language": {
    en: "Select language",
    es: "Seleccionar idioma"
  },
  "timezone": {
    en: "Time Zone",
    es: "Zona horaria"
  },
  "timezone-description": {
    en: "All dates will be displayed in this timezone",
    es: "Todas las fechas se mostrarán en esta zona horaria"
  },
  "select-timezone": {
    en: "Select timezone",
    es: "Seleccionar zona horaria"
  },
  "save-settings": {
    en: "Save Settings",
    es: "Guardar configuración"
  },
  "settings-saved": {
    en: "Settings saved successfully",
    es: "Configuración guardada exitosamente"
  },
  "error-saving-settings": {
    en: "Error saving settings",
    es: "Error al guardar la configuración"
  },
  "date-time-preview": {
    en: "Date & Time Preview",
    es: "Vista previa de fecha y hora"
  },
  "date-time-preview-description": {
    en: "Preview how dates will be displayed with current settings",
    es: "Vista previa de cómo se mostrarán las fechas con la configuración actual"
  },
  "current-date-time": {
    en: "Current date and time:",
    es: "Fecha y hora actual:"
  },
  
  // Management section
  "management": {
    en: "Management",
    es: "Gestión"
  },
  "security": {
    en: "Security",
    es: "Seguridad"
  },
  "settings": {
    en: "Settings",
    es: "Configuración"
  },
  
  // Status and actions
  "active": {
    en: "Active",
    es: "Activo"
  },
  "pending": {
    en: "Pending",
    es: "Pendiente"
  },
  "blocked": {
    en: "Blocked",
    es: "Bloqueado"
  },
  "frozen": {
    en: "Frozen",
    es: "Congelado"
  },
  "status": {
    en: "Status",
    es: "Estado"
  },
  "actions": {
    en: "Actions",
    es: "Acciones"
  },
  "view": {
    en: "View",
    es: "Ver"
  },
  "edit": {
    en: "Edit",
    es: "Editar"
  },
  "delete": {
    en: "Delete",
    es: "Eliminar"
  },
  "save": {
    en: "Save",
    es: "Guardar"
  },
  "cancel": {
    en: "Cancel",
    es: "Cancelar"
  },
  "search": {
    en: "Search",
    es: "Buscar"
  },
  
  // Transaction related
  "transaction-id": {
    en: "Transaction ID",
    es: "ID de transacción"
  },
  "reference": {
    en: "Reference",
    es: "Referencia"
  },
  "date": {
    en: "Date",
    es: "Fecha"
  },
  "type": {
    en: "Type", 
    es: "Tipo"
  },
  "amount": {
    en: "Amount",
    es: "Monto"
  },
  "currency": {
    en: "Currency",
    es: "Moneda"
  },
  "completed": {
    en: "Completed",
    es: "Completado"
  },
  "cancelled": {
    en: "Cancelled",
    es: "Cancelado"
  },
  "failed": {
    en: "Failed", 
    es: "Fallido"
  },
  "deposit": {
    en: "Deposit",
    es: "Depósito"
  },
  "withdrawal": {
    en: "Withdrawal",
    es: "Retiro"
  },
  "transfer": {
    en: "Transfer",
    es: "Transferencia"
  },
  "compensation": {
    en: "Compensation",
    es: "Compensación"
  },
  
  // Wallet related
  "balance": {
    en: "Balance",
    es: "Saldo"
  },
  "available-balance": {
    en: "Available Balance",
    es: "Saldo disponible"
  },
  "wallet-id": {
    en: "Wallet ID",
    es: "ID de billetera"
  },
  "no-wallets-found": {
    en: "No wallets found",
    es: "No se encontraron billeteras"
  },
  "no-transactions-found": {
    en: "No transactions found",
    es: "No se encontraron transacciones"
  },
  "user-wallets": {
    en: "User Wallets",
    es: "Billeteras del usuario"
  },
  "wallet-transactions": {
    en: "Wallet Transactions",
    es: "Transacciones de billetera"
  },
  
  // Additional UI text
  "back-to-wallets": {
    en: "Back to Wallets",
    es: "Volver a Billeteras"
  },
  "loading": {
    en: "Loading...",
    es: "Cargando..."
  },
  "unknown": {
    en: "Unknown",
    es: "Desconocido"
  },
  "error": {
    en: "Error",
    es: "Error"
  },
};

// Get translation for a key
export const translate = (key: string, language: Language): string => {
  if (translations[key]) {
    return translations[key][language];
  }
  
  // Return the key itself if no translation is found
  console.warn(`Translation not found for key: ${key}`);
  return key;
};

// Function to be used in components
export const useTranslation = (language: Language) => {
  return (key: string): string => translate(key, language);
};
