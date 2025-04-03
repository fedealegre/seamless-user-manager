
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
    es: "Dashboard"
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
    es: "Configuración de la compañía"
  },
  "user-field-settings": {
    en: "User Field Settings",
    es: "Configuración de campos de usuario"
  },
  "backoffice-settings": {
    en: "Backoffice Settings",
    es: "Configuración del BackOffice"
  },
  
  // Dashboard specific
  "total-users": {
    en: "Total Users",
    es: "Usuarios Totales"
  },
  "total-registered-users": {
    en: "Total registered users",
    es: "Total de usuarios registrados"
  },
  "active-wallets": {
    en: "Active Wallets",
    es: "Billeteras Activas"
  },
  "wallets-with-activity": {
    en: "Wallets with activity in last 30 days",
    es: "Billeteras con actividad en los últimos 30 días"
  },
  "transactions-7d": {
    en: "Transactions (7d)",
    es: "Transacciones (7d)"
  },
  "transactions-last-7-days": {
    en: "Transactions in the last 7 days",
    es: "Transacciones en los últimos 7 días"
  },
  "flagged-transactions": {
    en: "Flagged Transactions",
    es: "Transacciones Marcadas"
  },
  "transactions-flagged-suspicious": {
    en: "Transactions flagged as suspicious",
    es: "Transacciones marcadas como sospechosas"
  },
  "transaction-overview": {
    en: "Transaction Overview",
    es: "Resumen de Transacciones"
  },
  "transaction-volume-count": {
    en: "Transaction volume and count over time",
    es: "Volumen y recuento de transacciones a lo largo del tiempo"
  },
  "transaction-volume": {
    en: "Transaction Volume ($)",
    es: "Volumen de Transacciones ($)"
  },
  "transaction-count": {
    en: "Transaction Count",
    es: "Recuento de Transacciones"
  },
  "transaction-types": {
    en: "Transaction Types",
    es: "Tipos de Transacciones"
  },
  "distribution-by-category": {
    en: "Distribution by transaction category",
    es: "Distribución por categoría de transacción"
  },
  "user-growth": {
    en: "User Growth",
    es: "Crecimiento de Usuarios"
  },
  "new-user-registrations": {
    en: "New user registrations over time",
    es: "Nuevos registros de usuarios a lo largo del tiempo"
  },
  "new-users": {
    en: "New Users",
    es: "Nuevos Usuarios"
  },
  "recent-alerts": {
    en: "Recent Alerts",
    es: "Alertas Recientes"
  },
  "security-system-alerts": {
    en: "Security and system alerts",
    es: "Alertas de seguridad y sistema"
  },
  "day": {
    en: "Day",
    es: "Día"
  },
  "week": {
    en: "Week",
    es: "Semana"
  },
  "month": {
    en: "Month",
    es: "Mes"
  },
  "year": {
    en: "Year",
    es: "Año"
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
  "refresh": {
    en: "Refresh",
    es: "Actualizar"
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
  "wallet": {
    en: "Wallet",
    es: "Billetera"
  },
  "all-wallets": {
    en: "All Wallets",
    es: "Todas las Billeteras"
  },
  "manage-wallets-for-all-users": {
    en: "Manage wallets for all users",
    es: "Administrar billeteras para todos los usuarios"
  },
  "search-wallets": {
    en: "Search wallets...",
    es: "Buscar billeteras..."
  },
  "across-all-users": {
    en: "Across all users",
    es: "A través de todos los usuarios"
  },
  "currently-active": {
    en: "Currently active",
    es: "Actualmente activas"
  },
  "total-balance": {
    en: "Total Balance",
    es: "Saldo Total"
  },
  "usd-equivalent": {
    en: "USD equivalent",
    es: "Equivalente en USD"
  },
  "users-with-wallets": {
    en: "Users with Wallets",
    es: "Usuarios con Billeteras"
  },
  "total-users-with-wallets": {
    en: "Total users with wallets",
    es: "Total de usuarios con billeteras"
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
  
  // Export related
  "export-csv": {
    en: "Export CSV",
    es: "Exportar CSV"
  },
  "no-data-to-export": {
    en: "No data to export",
    es: "No hay datos para exportar"
  },
  "export-successful": {
    en: "Export Successful",
    es: "Exportación Exitosa"
  },
  "data-exported-successfully": {
    en: "The data has been exported to CSV successfully",
    es: "Los datos han sido exportados a CSV exitosamente"
  },
  "user-id": {
    en: "User ID",
    es: "ID de usuario"
  },
  "transactions-found": {
    en: "transactions found",
    es: "transacciones encontradas"
  },
  "monitor-and-manage-payment-transactions": {
    en: "Monitor and manage payment transactions",
    es: "Monitorear y gestionar transacciones de pagos"
  },
  "income": {
    en: "Income",
    es: "Ingreso"
  },
  "outcome": {
    en: "Outcome",
    es: "Egreso"
  },
  "transaction-cancellation-not-implemented": {
    en: "Transaction cancellation not implemented for",
    es: "Cancelación de transacción no implementada para"
  },
  "cancel-transaction": {
    en: "Cancel Transaction",
    es: "Cancelar Transacción"
  },
  "compensate": {
    en: "Compensate",
    es: "Compensar"
  },
  "customer": {
    en: "Customer",
    es: "Cliente"
  },
  "details": {
    en: "Details",
    es: "Detalles"
  },
  "transactions-for-wallet": {
    en: "Transactions for wallet",
    es: "Transacciones para la billetera"
  },
  "user-transactions": {
    en: "User Transactions",
    es: "Transacciones de Usuario"
  },
  "view-wallet-transactions": {
    en: "View wallet transactions",
    es: "Ver transacciones de billetera"
  },
  "found": {
    en: "found",
    es: "encontradas"
  },
  "click-wallet-view-transactions": {
    en: "Click on a wallet to view its transactions",
    es: "Haga clic en una billetera para ver sus transacciones"
  },
  "missing-transaction-wallet-info": {
    en: "Missing transaction or wallet information",
    es: "Falta información de transacción o billetera"
  },
  "compensation-processed": {
    en: "Compensation Processed",
    es: "Compensación Procesada"
  },
  "compensation-transaction-created": {
    en: "Compensation transaction has been created successfully",
    es: "La transacción de compensación ha sido creada exitosamente"
  },
  "compensation-failed": {
    en: "Compensation Failed",
    es: "Compensación Fallida"
  },
  "compensation-error": {
    en: "An error occurred during the compensation process",
    es: "Ocurrió un error durante el proceso de compensación"
  },
  
  // Audit log related
  "audit-log-details": {
    en: "Audit Log Details",
    es: "Detalles del Registro de Auditoría"
  },
  "detailed-info-audit-log": {
    en: "Detailed information about the selected audit log entry",
    es: "Información detallada sobre la entrada de registro de auditoría seleccionada"
  },
  "timestamp": {
    en: "Timestamp",
    es: "Marca de tiempo"
  },
  "user": {
    en: "User",
    es: "Usuario"
  },
  "operation-type": {
    en: "Operation Type",
    es: "Tipo de Operación"
  },
  "entity": {
    en: "Entity",
    es: "Entidad"
  },
  "previous-value": {
    en: "Previous Value",
    es: "Valor Anterior"
  },
  "new-value": {
    en: "New Value",
    es: "Nuevo Valor"
  },
  "start-date": {
    en: "Start Date",
    es: "Fecha de Inicio"
  },
  "end-date": {
    en: "End Date",
    es: "Fecha de Fin"
  },
  "search-by-user": {
    en: "Search by user",
    es: "Buscar por usuario"
  },
  "all-operations": {
    en: "All operations",
    es: "Todas las operaciones"
  },
  "operation-types": {
    en: "Operation Types",
    es: "Tipos de Operación"
  },
  "reset-filters": {
    en: "Reset Filters",
    es: "Restablecer Filtros"
  },
  "date-time": {
    en: "Date & Time",
    es: "Fecha y Hora"
  },
  "operation": {
    en: "Operation",
    es: "Operación"
  },
  "no-log-entries-found": {
    en: "No log entries found",
    es: "No se encontraron entradas de registro"
  },
  "adjust-filters": {
    en: "Try adjusting your filters or checking back later",
    es: "Intente ajustar sus filtros o vuelva más tarde"
  },
  "view-details": {
    en: "View Details",
    es: "Ver Detalles"
  },
  
  // Backoffice users
  "block-backoffice-user": {
    en: "Block Backoffice User",
    es: "Bloquear Usuario de Backoffice"
  },
  "block-confirmation": {
    en: "Are you sure you want to block",
    es: "¿Está seguro de que desea bloquear"
  },
  "block-warning": {
    en: "They will no longer be able to access the backoffice system",
    es: "Ya no podrán acceder al sistema de backoffice"
  },
  "user-blocked-success": {
    en: "User blocked successfully",
    es: "Usuario bloqueado exitosamente"
  },
  "failed-block-user": {
    en: "Failed to block user",
    es: "Error al bloquear usuario"
  },
  "user-not-found": {
    en: "User not found. The user may have been deleted",
    es: "Usuario no encontrado. Es posible que el usuario haya sido eliminado"
  },
  "cannot-block-without-id": {
    en: "Cannot block user without an ID",
    es: "No se puede bloquear al usuario sin un ID"
  },
  "blocking": {
    en: "Blocking...",
    es: "Bloqueando..."
  },
  "block-user": {
    en: "Block User",
    es: "Bloquear Usuario"
  }
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
